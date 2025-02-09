using Learning.Data;
using Learning.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Learning.Features.Sessions;

public interface ISessionRepository
{
    Task<Session[]> GetSessionsAsync(Guid teacherId, int skip, int take, CancellationToken token);
    Task<Session[]> GetEnrolledSessionsAsync(Guid studentId, int skip, int take, CancellationToken token);
    Task<Session> GetSessionByIdAsync(long id, CancellationToken token);
    Task<bool> IsSessionExistsAsync(long id, CancellationToken token);
    Task AddSessionAsync(Session session, CancellationToken token);
    Task UpdateSessionAsync(Session session, CancellationToken token);
}

public class SessionRepository(AppDbContext db) : ISessionRepository
{
    public Task<Session[]> GetSessionsAsync(Guid teacherId, int skip, int take, CancellationToken token)
    {
        return db.Session.Where(e => e.TeacherUserId == teacherId && !e.IsDeleted).Skip(skip).Take(take).ToArrayAsync(token);
    }

    public Task<Session[]> GetEnrolledSessionsAsync(Guid studentId, int skip, int take, CancellationToken token)
    {
        return db.Enrollment.Where(e => e.StudentUserId == studentId)
            .OrderBy(e => e.CreatedAt)
            .Select(e => e.Session)
            .Where(e => !e.IsDeleted)
            .Skip(skip)
            .Take(take)
            .ToArrayAsync(token);
    }

    public Task<Session> GetSessionByIdAsync(long id, CancellationToken token)
    {
        return db.Session.Include(e => e.Options).Where(e => e.Id == id && !e.IsDeleted).FirstOrDefaultAsync(token);
    }

    public Task<bool> IsSessionExistsAsync(long id, CancellationToken token)
    {
        return db.Session.AnyAsync(e => e.Id == id && !e.IsDeleted, token);
    }

    public async Task AddSessionAsync(Session session, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(session);

        await db.Session.AddAsync(session, token);
        await db.SaveChangesAsync(token);
    }

    public async Task UpdateSessionAsync(Session session, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(session);

        await db.SaveChangesAsync(token);
    }
}