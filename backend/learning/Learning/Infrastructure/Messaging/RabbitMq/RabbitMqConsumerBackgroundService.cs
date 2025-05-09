using System.Text;
using Learning.Infrastructure.Messaging.RabbitMq.Consumers;
using Learning.Utils;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Learning.Infrastructure.Messaging.RabbitMq;

public class RabbitMqConsumerBackgroundService(
    IEnumerable<IMessageConsumer> consumers,
    RabbitMqConnectionProvider provider,
    IOptions<RabbitMqOptions> options,
    ILogger<RabbitMqConsumerBackgroundService> logger
) : BackgroundService, IAsyncDisposable
{

    private readonly RabbitMqOptions _options = options.Value;
    private readonly List<IChannel> _channels = [];
    private readonly Dictionary<IChannel, string> _consumerTags = [];

    protected override async Task ExecuteAsync(CancellationToken token)
    {
        try
        {
            var connection = await provider.Connection;

            foreach (var consumer in consumers)
            {
                try
                {
                    await SetupConsumerAsync(connection, consumer, token);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to set up consumer for queue {queueName}", consumer.QueueName);
                }
            }

            await Task.Delay(Timeout.Infinite, token);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation("RabbitMQ consumer service shutting down");
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Fatal error in RabbitMQ consumer service");
            throw;
        }
    }

    public override async Task StopAsync(CancellationToken token)
    {
        logger.LogInformation("Stopping RabbitMQ consumers");

        foreach (var channel in _channels)
        {
            try
            {
                if (_consumerTags.TryGetValue(channel, out var tag))
                {
                    await channel.BasicCancelAsync(tag, cancellationToken: token);
                }

                await channel.CloseAsync(token);
                channel.Dispose();
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Error closing RabbitMQ channel");
            }
        }

        await base.StopAsync(token);
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var channel in _channels)
        {
            try
            {
                if (_consumerTags.TryGetValue(channel, out var tag))
                {
                    await channel.BasicCancelAsync(tag);
                }

                await channel.CloseAsync();
                channel.Dispose();
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Error during async disposal of RabbitMQ channel");
            }
        }
    }


    private async Task SetupConsumerAsync(IConnection connection, IMessageConsumer consumer, CancellationToken token)
    {

        var channel = await connection.CreateChannelAsync(cancellationToken: token);
        _channels.Add(channel);
        await channel.BasicQosAsync(0, _options.PrefetchCount, false, cancellationToken: token);

        await channel.ExchangeDeclareAsync(_options.Exchange, ExchangeType.Topic, durable: true, cancellationToken: token);
        await channel.ExchangeDeclareAsync(_options.DeadLetterExchange, ExchangeType.Topic, durable: true, cancellationToken: token);

        var queueArgs = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", _options.DeadLetterExchange },
            { "x-dead-letter-routing-key", Constants.LearningDlqRoutingKey },
            { "x-message-ttl", _options.MessageTtl }
        };

        await channel.QueueDeclareAsync(
            queue: consumer.QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: queueArgs,
            cancellationToken: token
        );

        foreach (var pattern in consumer.RoutingPatterns)
        {
            await channel.QueueBindAsync(consumer.QueueName, _options.Exchange, pattern, cancellationToken: token);
            logger.LogInformation(
                "Bound queue {queueName} to exchange {exchange} with pattern {pattern}",
                consumer.QueueName,
                _options.Exchange,
                pattern
            );
        }

        var asyncConsumer = new AsyncEventingBasicConsumer(channel);
        asyncConsumer.ReceivedAsync += async (_, ea) => await HandleMessageAsync(channel, consumer, ea, token);

        var consumerTag = await channel.BasicConsumeAsync(
            queue: consumer.QueueName,
            autoAck: false,
            consumer: asyncConsumer,
            cancellationToken: token
        );
        _consumerTags[channel] = consumerTag;
    }

    private async Task HandleMessageAsync(
        IChannel channel,
        IMessageConsumer consumer,
        BasicDeliverEventArgs ea,
        CancellationToken token
    )
    {
        try
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var headers = ea.BasicProperties.Headers ?? new Dictionary<string, object>();

            var messageId = ea.BasicProperties.MessageId ?? "unknown";
            var correlationId = ea.BasicProperties.CorrelationId ?? "unknown";

            logger.LogDebug(
                "Received message: id={messageId}, correlationId={correlationId}, queue={queueName}",
                messageId,
                correlationId,
                consumer.QueueName
            );

            var success = await ProcessWithRetryAsync(consumer, message, headers, token);
            if (success)
            {
                await channel.BasicAckAsync(ea.DeliveryTag, false, cancellationToken: token);
                logger.LogDebug("Acknowledged message: {messageId}", messageId);
            }
            else
            {
                await channel.BasicNackAsync(ea.DeliveryTag, false, false, cancellationToken: token);
                logger.LogWarning("Rejected message {messageId}, sent to DLQ", messageId);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing message on queue {queueName}", consumer.QueueName);
            try
            {
                await channel.BasicNackAsync(ea.DeliveryTag, false, false, cancellationToken: token);
            }
            catch (Exception nackEx)
            {
                logger.LogError(nackEx, "Failed to NACK message");
            }
        }
    }

    private async Task<bool> ProcessWithRetryAsync(
        IMessageConsumer consumer,
        string message,
        IDictionary<string, object> headers,
        CancellationToken token
    )
    {
        int retries = 0;
        int maxRetries = _options.RetryCount;
        int delay = _options.InitialRetryIntervalMs;

        while (true)
        {
            try
            {
                return await consumer.HandleAsync(message, headers, token);
            }
            catch (Exception ex)
            {
                retries++;
                if (retries > maxRetries)
                {
                    logger.LogError(ex, "Failed to process message after {retries} retries", retries);
                    return false;
                }

                logger.LogWarning(ex, "Error processing message (attempt {retries}/{maxRetries}). Retrying in {delay}ms",
                    retries, maxRetries, delay);

                await Task.Delay(delay, token);
                delay = RetryDelayCalculator.Calculate(retries, _options.InitialRetryIntervalMs, _options.RetryMultiplier, _options.MaxRetryIntervalMs);
            }
        }
    }
}