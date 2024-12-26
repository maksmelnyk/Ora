namespace Learning.Data.Entities;

public class Enrollment
{
    public long Id { get; set; }
    public long SessionId { get; set; }
    public Guid StudentUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; } 
}