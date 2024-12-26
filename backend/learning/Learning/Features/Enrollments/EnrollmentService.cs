using Learning.Data.Entities;
using Learning.Exceptions;
using Learning.Features.Sessions;
using Learning.Infrastructure.Identity;

namespace Learning.Features.Enrollments;

public interface IEnrollmentService
{
    Task AddEnrollmentAsync(long sessionId, CancellationToken token);
}

public class EnrollmentService(
    ICurrentUser currentUser,
    IEnrollmentRepository enrollmentRepository,
    ISessionRepository sessionRepository
) : IEnrollmentService
{
    public async Task AddEnrollmentAsync(long sessionId, CancellationToken token)
    {
        if (!await sessionRepository.IsSessionExistsAsync(sessionId, token))
        {
            throw AppException.NotFound("Session not found", ErrorCode.SessionNotFound);
        }

        var enrollment = new Enrollment
        {
            SessionId = sessionId,
            StudentUserId = currentUser.GetUserId(),
            CreatedAt = DateTime.UtcNow
        };

        await enrollmentRepository.AddEnrollmentAsync(enrollment, token);
    }
}