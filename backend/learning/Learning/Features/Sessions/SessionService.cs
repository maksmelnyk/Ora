using FluentValidation;
using Learning.Exceptions;
using Learning.Features.Sessions.Contracts;
using Learning.Infrastructure.Identity;

namespace Learning.Features.Sessions;

public interface ISessionService
{
    Task<IEnumerable<SessionSummaryResponse>> GetTeacherSessionsAsync(
        Guid teacherId,
        int skip,
        int take,
        CancellationToken token
    );
    Task<IEnumerable<SessionSummaryResponse>> GetMyEnrolledSessionsAsync(
        int skip,
        int take,
        CancellationToken token
    );
    Task<SessionDetailsResponse> GetSessionDetailsAsync(long id, CancellationToken token);
    Task CreateMySessionAsync(SessionRequest request, CancellationToken token);
    Task UpdateMySessionAsync(long id, SessionRequest request, CancellationToken token);
    Task DeleteMySessionAsync(long id, CancellationToken token);

}

public sealed class SessionService(
    ICurrentUser currentUser,
    ISessionRepository repository,
    IValidator<SessionRequest> validator
) : ISessionService
{
    public async Task<IEnumerable<SessionSummaryResponse>> GetTeacherSessionsAsync(
        Guid teacherId,
        int skip,
        int take,
        CancellationToken token
    )
    {
        var sessions = await repository.GetSessionsAsync(teacherId, skip, take, token);
        if (sessions.Length == 0)
        {
            return [];
        }

        return sessions.Select(SessionMapper.ToSessionSummary);
    }

    public async Task<IEnumerable<SessionSummaryResponse>> GetMyEnrolledSessionsAsync(
        int skip,
        int take,
        CancellationToken token
    )
    {
        var sessions = await repository.GetEnrolledSessionsAsync(currentUser.GetUserId(), skip, take, token);
        if (sessions.Length == 0)
        {
            return [];
        }


        return sessions.Select(SessionMapper.ToSessionSummary);
    }

    public async Task<SessionDetailsResponse> GetSessionDetailsAsync(long id, CancellationToken token)
    {
        var session = await repository.GetSessionByIdAsync(id, token);
        if (session is null)
        {
            return null;
        }

        return SessionMapper.ToSessionDetails(session);
    }

    public async Task CreateMySessionAsync(SessionRequest request, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(request);

        await validator.ValidateAndThrowAsync(request, token);

        var session = SessionMapper.ToSession(request, currentUser.GetUserId());

        await repository.AddSessionAsync(session, token);
    }

    public async Task UpdateMySessionAsync(long id, SessionRequest request, CancellationToken token)
    {
        await validator.ValidateAndThrowAsync(request, token);

        var session = await repository.GetSessionByIdAsync(id, token);

        if (session.TeacherUserId != currentUser.GetUserId())
        {
            throw new ResourceNotFoundException("Session not found", ErrorCode.SessionNotFound);
        }

        SessionMapper.MapToSession(session, request);

        await repository.UpdateSessionAsync(session, token);
    }

    public async Task DeleteMySessionAsync(long id, CancellationToken token)
    {
        var session = await repository.GetSessionByIdAsync(id, token);

        if (session.TeacherUserId != currentUser.GetUserId())
        {
            throw new ResourceNotFoundException("Session not found", ErrorCode.SessionNotFound);
        }

        session.IsDeleted = true;
        await repository.UpdateSessionAsync(session, token);
    }
}