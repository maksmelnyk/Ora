using Learning.Data;
using Learning.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Learning.Features.Profiles;

public interface IProfileRepository
{
    Task<ProfileSummary[]> GetProfilesAsync(IEnumerable<Guid> ids, CancellationToken token);
    Task<ProfileSummary> GetProfileAsync(Guid userId, CancellationToken token);
    Task<bool> ProfileExistsAsync(Guid userId, CancellationToken token);
    Task AddProfileAsync(ProfileSummary profileSummary, CancellationToken token);
    Task UpdateProfileAsync(ProfileSummary profileSummary, CancellationToken token);
}

public class ProfileRepository(AppDbContext db) : IProfileRepository
{
    public Task<ProfileSummary[]> GetProfilesAsync(IEnumerable<Guid> ids, CancellationToken token)
    {
        return db.ProfileSummaries.AsNoTracking().ToArrayAsync(token);
    }

    public Task<ProfileSummary> GetProfileAsync(Guid userId, CancellationToken token)
    {
        return db.ProfileSummaries.FirstOrDefaultAsync(s => s.UserId == userId, token);
    }

    public Task<bool> ProfileExistsAsync(Guid userId, CancellationToken token)
    {
        return db.ProfileSummaries.AnyAsync(s => s.UserId == userId, token);
    }

    public async Task AddProfileAsync(ProfileSummary profileSummary, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(profileSummary);

        await db.ProfileSummaries.AddAsync(profileSummary, token);
        await db.SaveChangesAsync(token);
    }

    public Task UpdateProfileAsync(ProfileSummary profileSummary, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(profileSummary);
        return db.SaveChangesAsync(token);
    }
}