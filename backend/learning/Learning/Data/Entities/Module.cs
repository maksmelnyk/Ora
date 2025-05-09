using Learning.Data.Interfaces;

namespace Learning.Data.Entities;

public class Module : ITimeTrackable
{
    public long Id { get; set; }
    public long ProductId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public virtual Product Product { get; set; }
    public virtual ICollection<Lesson> Lessons { get; set; }
}