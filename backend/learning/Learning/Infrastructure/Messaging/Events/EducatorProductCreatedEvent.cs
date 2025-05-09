namespace Learning.Infrastructure.Messaging.Events;

public sealed record EducatorProductCreatedEvent : BaseEvent
{
    public override string EventType { get; init; } = Constants.EducatorProductCreated;
    public string UserId { get; init; }
}