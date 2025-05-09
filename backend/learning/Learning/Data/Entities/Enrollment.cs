using Learning.Data.Interfaces;

namespace Learning.Data.Entities;

public class Enrollment : ITimeTrackable
{
    public long Id { get; set; }
    public long ProductId { get; set; }
    public long? ScheduledEventId { get; set; }
    public Guid UserId { get; set; }
    public EnrollmentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public enum EnrollmentStatus
{
    Active = 0,
    Completed = 1,
    Canceled = 2,
}