namespace Learning.Data.Entities;

public class Session
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsDeleted { get; set; }
    public SessionType Type { get; set; }
    public Guid TeacherUserId { get; set; }
    public List<SessionOption> Options { get; set; }
}