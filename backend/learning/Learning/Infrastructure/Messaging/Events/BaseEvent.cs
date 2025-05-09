namespace Learning.Infrastructure.Messaging.Events;

public interface IBaseEvent
{
    public string EventId { get; init; }
    public string EventType { get; init; }
    public string CorrelationId { get; init; }
    public string Timestamp { get; init; }
}

public abstract record BaseEvent : IBaseEvent
{
    public string EventId { get; init; } = Guid.NewGuid().ToString();
    public string Timestamp { get; init; } = DateTime.UtcNow.ToString("o");
    public string CorrelationId { get; init; } = Guid.NewGuid().ToString();
    public abstract string EventType { get; init; }
}
