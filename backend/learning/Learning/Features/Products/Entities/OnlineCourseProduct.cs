namespace Learning.Features.Products.Entities;

public class OnlineCourseProduct
{
    public long ProductId { get; set; }
    public int MaxParticipants { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
}