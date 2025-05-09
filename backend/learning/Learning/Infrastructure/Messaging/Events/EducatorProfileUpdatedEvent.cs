namespace Learning.Infrastructure.Messaging.Events;

public sealed record EducatorProfileUpdatedEvent : BaseEvent
{
    public override string EventType { get; init; } = Constants.EducatorProfileUpdated;
    public string UserId { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public string ImageUrl { get; init; }
}