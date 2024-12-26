using Learning.Data.Entities;
using Learning.Features.Sessions.Contracts;

namespace Learning.Features.Sessions;

public static class SessionMapper
{
    public static SessionSummaryResponse ToSessionSummary(Session session)
    {
        return new SessionSummaryResponse
        {
            Id = session.Id,
            Title = session.Title
        };
    }

    public static SessionDetailsResponse ToSessionDetails(Session session)
    {
        return new SessionDetailsResponse
        {
            Id = session.Id,
            Title = session.Title,
            Description = session.Description,
            Type = session.Type,
            Options = session.Options?.Select(e => new SessionOptionResponse
            {
                Id = e.Id,
                Duration = e.Duration
            }).ToArray()
        };
    }

    public static Session ToSession(SessionRequest request, Guid teacherId)
    {
        return new Session
        {
            TeacherUserId = teacherId,
            Title = request.Title,
            Description = request.Description,
            Type = request.Type,
            Options = request.Options?.Select(ToSessionOption).ToList()
        };
    }

    public static void MapToSession(Session session, SessionRequest request)
    {
        session.Title = request.Title;
        session.Description = request.Description;
        session.Type = request.Type;
        session.Options = request.Options?.Select(ToSessionOption).ToList();
    }

    public static SessionOption ToSessionOption(SessionOptionRequest request)
    {
        return new SessionOption
        {
            Duration = request.Duration
        };
    }
}