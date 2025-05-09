namespace Learning.Infrastructure.Messaging.Events;

public sealed record BookingCompletedEvent : BaseEvent
{
    public override string EventType { get; init; } = Constants.BookingCompleted;
    public string UserId { get; init; }
    public long EnrollmentId { get; init; }
}