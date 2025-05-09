using Learning.Data;
using Learning.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Learning.Features.Enrollments;

public interface IEnrollmentRepository
{
    Task<Enrollment> GetUserEnrollmentByIdAsync(Guid userId, long id, CancellationToken token);
    Task<long[]> GetEnrolledProductIdsAsync(Guid userId, long[] ids, CancellationToken token);
    Task<int> GetProductEnrollmentsCountAsync(long productId, long? scheduledEventId, CancellationToken token);
    Task<bool> EnrolmentExistsAsync(Guid userId, long productId, long? scheduledEventId, CancellationToken token);
    Task AddEnrollmentAsync(Enrollment enrollment, CancellationToken token);
    Task UpdateEnrollmentAsync(Enrollment enrollment, CancellationToken token);
}

public class EnrollmentRepository(AppDbContext db) : IEnrollmentRepository
{
    public Task<Enrollment> GetUserEnrollmentByIdAsync(Guid userId, long id, CancellationToken token)
    {
        return db.Enrollments.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId, token);
    }

    public Task<long[]> GetEnrolledProductIdsAsync(Guid userId, long[] ids, CancellationToken token)
    {
        return db.Enrollments.Where(e => e.UserId == userId && ids.Contains(e.ProductId)).Select(e => e.ProductId).ToArrayAsync(token);
    }

    public Task<int> GetProductEnrollmentsCountAsync(long productId, long? scheduledEventId, CancellationToken token)
    {
        return db.Enrollments.CountAsync(
            e => e.ProductId == productId &&
                e.ScheduledEventId == scheduledEventId &&
                e.Status != EnrollmentStatus.Canceled,
                token
        );
    }

    public Task<bool> EnrolmentExistsAsync(Guid userId, long productId, long? scheduledEventId, CancellationToken token)
    {
        return db.Enrollments.AnyAsync(
            e => e.ProductId == productId &&
                e.UserId == userId &&
                e.ScheduledEventId == scheduledEventId &&
                e.Status != EnrollmentStatus.Canceled,
                token
        );
    }

    public async Task AddEnrollmentAsync(Enrollment enrollment, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(enrollment);

        await db.Enrollments.AddAsync(enrollment, token);
        await db.SaveChangesAsync(token);
    }

    public Task UpdateEnrollmentAsync(Enrollment enrollment, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(enrollment);

        return db.SaveChangesAsync(token);
    }
}