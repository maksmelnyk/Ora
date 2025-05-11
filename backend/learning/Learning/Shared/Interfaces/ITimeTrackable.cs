namespace Learning.Shared.Interfaces;

public interface ITimeTrackable
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}