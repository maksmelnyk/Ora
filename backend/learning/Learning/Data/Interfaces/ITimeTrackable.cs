namespace Learning.Data.Interfaces;

public interface ITimeTrackable
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}