namespace Learning.Infrastructure.Messaging.RabbitMq.Consumers;

public interface IMessageConsumer
{
    string QueueName { get; }
    string[] RoutingPatterns { get; }
    Task<bool> HandleAsync(string message, IDictionary<string, object> headers, CancellationToken token);
}
