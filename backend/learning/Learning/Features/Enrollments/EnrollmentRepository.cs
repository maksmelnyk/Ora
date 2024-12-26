using Learning.Data;
using Learning.Data.Entities;

namespace Learning.Features.Enrollments;

public interface IEnrollmentRepository
{
    Task AddEnrollmentAsync(Enrollment enrollment, CancellationToken token);
}

public class EnrollmentRepository(AppDbContext db) : IEnrollmentRepository
{

    public async Task AddEnrollmentAsync(Enrollment enrollment, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(enrollment);

        await db.Enrollment.AddAsync(enrollment, token);
        await db.SaveChangesAsync(token);
    }
}