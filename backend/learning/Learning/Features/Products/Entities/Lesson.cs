using Learning.Shared.Interfaces;

namespace Learning.Features.Products.Entities;

public class Lesson : ITimeTrackable
{
    public long Id { get; set; }
    public long ModuleId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int DurationMin { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public virtual Module Module { get; set; }
}