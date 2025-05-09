using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;
using Learning.Infrastructure.Messaging.Events;

namespace Learning.Infrastructure.Messaging.RabbitMq.Publishers;

public interface IMessagePublisher : IAsyncDisposable
{
    Task<bool> PublishAsync<T>(string routingKey, T message, CancellationToken token)
        where T : IBaseEvent;
}

public class RabbitMqPublisher : IMessagePublisher, IAsyncDisposable
{
    private readonly ILogger<RabbitMqPublisher> _logger;
    private readonly Task<IChannel> _channelTask;
    private readonly RabbitMqOptions _options;

    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public RabbitMqPublisher(
        RabbitMqConnectionProvider provider,
        IOptions<RabbitMqOptions> options,
        ILogger<RabbitMqPublisher> logger
    )
    {
        _logger = logger;
        _options = options.Value;
        _channelTask = InitializeChannelAsync(provider);
    }

    private async Task<IChannel> InitializeChannelAsync(RabbitMqConnectionProvider provider, CancellationToken token = default)
    {
        try
        {
            var connection = await provider.Connection;

            var rateLimiter = new ThrottlingRateLimiter(_options.MaxOutstandingConfirms);

            var channelOptions = new CreateChannelOptions(
                    publisherConfirmationsEnabled: true,
                    publisherConfirmationTrackingEnabled: true,
                    outstandingPublisherConfirmationsRateLimiter: rateLimiter
                );

            var channel = await connection.CreateChannelAsync(channelOptions, cancellationToken: token);

            channel.ChannelShutdownAsync += Channel_ChannelShutdownAsync;
            channel.BasicReturnAsync += BasicReturnAsyncHandler;

            await channel.ExchangeDeclareAsync(_options.Exchange, ExchangeType.Topic, durable: true, cancellationToken: token);
            await channel.ExchangeDeclareAsync(_options.DeadLetterExchange, ExchangeType.Topic, durable: true, cancellationToken: token);

            return channel;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize RabbitMQ channel.");
            throw;
        }
    }

    public async Task<bool> PublishAsync<T>(string routingKey, T message, CancellationToken token)
        where T : IBaseEvent
    {
        var channel = await _channelTask;

        var messageId = message.EventId;
        var json = JsonSerializer.Serialize(message, SerializerOptions);
        var body = Encoding.UTF8.GetBytes(json);

        var properties = new BasicProperties
        {
            MessageId = messageId.ToString(),
            CorrelationId = message.CorrelationId.ToString(),
            Persistent = true,
            Type = message.EventType,
            Headers = new Dictionary<string, object>
            {
                ["__TypeId__"] = message.EventType
            }
        };

        var publishTag = await channel.GetNextPublishSequenceNumberAsync(token);
        using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(_options.PublisherConfirmTimeoutMs));
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(token, cts.Token);

        try
        {
            _logger.LogDebug("Publishing message {messageId} with tag {publishTag} to {routingKey} and waiting for confirmation...", messageId, publishTag, routingKey);

            await channel.BasicPublishAsync(
                exchange: _options.Exchange,
                routingKey: routingKey,
                mandatory: true,
                basicProperties: properties,
                body: body,
                cancellationToken: linkedCts.Token
            );

            _logger.LogDebug("Message {messageId} published and ACKED successfully to {routingKey}", messageId, routingKey);
            return true;
        }
        catch (OperationCanceledException) when (cts.IsCancellationRequested)
        {
            _logger.LogWarning("Publish confirmation timed out after {timeout}ms for message {messageId} (tag {publishTag})",
                _options.PublisherConfirmTimeoutMs, messageId, publishTag);
            return false;
        }
        catch (OperationCanceledException) when (token.IsCancellationRequested)
        {
            _logger.LogWarning("Publish operation cancelled for message {messageId} (tag {publishTag})", messageId, publishTag);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish message {messageId} (tag {publishTag}) to {routingKey}", messageId, publishTag, routingKey);
            return false;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (!_channelTask.IsCompletedSuccessfully)
            return;

        var channel = await _channelTask;
        if (channel == null || !channel.IsOpen)
            return;

        try
        {
            channel.ChannelShutdownAsync -= Channel_ChannelShutdownAsync;
            channel.BasicReturnAsync -= BasicReturnAsyncHandler;

            await channel.CloseAsync();
            _logger.LogInformation("RabbitMQ publisher channel closed gracefully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during RabbitMQ publisher shutdown.");
        }
    }

    private Task Channel_ChannelShutdownAsync(object sender, ShutdownEventArgs e)
    {
        _logger.LogWarning(
            "RabbitMQ channel shut down. Code: {replyCode}, Text: {replyText}, Initiator: {initiator}",
            e.ReplyCode,
            e.ReplyText,
            e.Initiator
        );

        return Task.CompletedTask;
    }

    private Task BasicReturnAsyncHandler(object sender, BasicReturnEventArgs args)
    {
        _logger.LogWarning(
            "Message returned: exchange={exchange}, routingKey={routingKey}, replyCode={replyCode}, replyText={replyText}, messageId={messageId}",
            args.Exchange,
            args.RoutingKey,
            args.ReplyCode,
            args.ReplyText,
            args.BasicProperties?.MessageId
        );

        return Task.CompletedTask;
    }
}