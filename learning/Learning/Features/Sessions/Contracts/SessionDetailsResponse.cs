using Learning.Data.Entities;

namespace Learning.Features.Sessions.Contracts;

public class SessionDetailsResponse
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public SessionType Type { get; set; }
    public SessionOptionResponse[] Options { get; set; }
}

public class SessionOptionResponse
{
    public long Id { get; set; }
    public int Duration { get; set; }
}