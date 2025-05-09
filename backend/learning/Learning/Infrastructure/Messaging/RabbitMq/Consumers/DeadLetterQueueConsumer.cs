using System.Text.Json;
using Learning.Utils;

namespace Learning.Infrastructure.Messaging.RabbitMq.Consumers;

public class DeadLetterQueueConsumer(ILogger<DeadLetterQueueConsumer> logger) : IMessageConsumer
{
    public string QueueName => Constants.LearningDlqName;
    public string[] RoutingPatterns => [Constants.LearningDlqRoutingKey];

    public Task<bool> HandleAsync(string rawMessage, IDictionary<string, object> headers, CancellationToken token)
    {
        var messageId = RabbitMqUtils.GetHeaderStringValue(headers, "message_id");
        var eventType = RabbitMqUtils.GetHeaderStringValue(headers, "__TypeId__");

        logger.LogError("DLQ message received: messageId={messageId}, eventType={eventType}", messageId, eventType);

        if (headers.TryGetValue("x-death", out var xDeathValue) && xDeathValue is List<object> xDeathList)
        {
            foreach (var deathEntry in xDeathList)
            {
                if (deathEntry is IDictionary<string, object> deathDict)
                {
                    var count = deathDict.TryGetValue("count", out var c) ? c : "n/a";
                    var reason = deathDict.TryGetValue("reason", out var r) ? r : "n/a";
                    var queue = deathDict.TryGetValue("queue", out var q) ? q : "n/a";
                    var exchange = deathDict.TryGetValue("exchange", out var exch) ? exch : "n/a";
                    var routingKeys = deathDict.TryGetValue("routing-keys", out var rk) ? (rk as List<object>)?.FirstOrDefault() : "n/a";

                    logger.LogWarning(
                        "x-death entry: count={count}, reason={reason}, queue={queue}, exchange={exchange}, routingKeys={routingKeys}",
                        count, reason, queue, exchange, routingKeys
                    );
                }
            }
        }
        else
        {
            logger.LogWarning("No x-death headers found for DLQ message {messageId}", messageId);
        }


        try
        {
            var baseEvent = JsonSerializer.Deserialize<JsonElement>(rawMessage);
            var correlationId = baseEvent.TryGetProperty("correlationId", out var corrId) && corrId.ValueKind == JsonValueKind.String ? corrId.GetString() : null;
            var timestamp = baseEvent.TryGetProperty("timestamp", out var ts) && ts.ValueKind == JsonValueKind.String ? ts.GetString() : null;

            logger.LogWarning(
                "Parsed DLQ Event: type={eventType}, id={messageId}, timestamp={timestamp}, correlationId={correlationId}",
                eventType,
                messageId,
                timestamp,
                correlationId
            );

            // --- DLQ Handling Actions ---
            // TODO: Implement specific error handling logic here
            // 1. Alerting: Send notification (e.g., Slack, Sentry)
            // 2. Persistence: Store the failed message (raw body, headers, x-death info) to a database for later analysis or manual retry
            // 3. Manual Retry: A separate process could read from the DLQ database and attempt to republish messages.

            return Task.FromResult(true);
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Failed to deserialize DLQ message body: {rawMessage}", rawMessage);
            return Task.FromResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error processing DLQ message: {rawMessage}", rawMessage);
            return Task.FromResult(true);
        }
    }
}