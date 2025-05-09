namespace Learning.Infrastructure.Messaging.Events;

public sealed record PaymentCompletedEvent : BaseEvent
{
    public override string EventType { get; init; } = Constants.PaymentCompleted;
    public string UserId { get; init; }
    public long ProductId { get; init; }
    public long? ScheduledEventId { get; init; }
}