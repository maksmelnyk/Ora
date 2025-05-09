namespace Learning.Infrastructure.Messaging.Events;

public sealed record EventScheduledEvent : BaseEvent
{
    public override string EventType { get; init; } = Constants.EventScheduled;
    public string UserId { get; init; }
    public long ProductId { get; init; }
    public string StartTime { get; init; }
    public string EndTime { get; init; }
}