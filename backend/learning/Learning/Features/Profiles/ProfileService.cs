using Learning.Data.Entities;

namespace Learning.Features.Profiles;

public interface IProfileService
{
    Task<Dictionary<Guid, EducatorResponse>> GetEducatorsAsync(IEnumerable<Guid> ids, CancellationToken token);
    Task UpdateProfileAsync(ProfileSummary profile, CancellationToken token);
}

public class ProfileService(IProfileRepository repo) : IProfileService
{
    public async Task<Dictionary<Guid, EducatorResponse>> GetEducatorsAsync(IEnumerable<Guid> ids, CancellationToken token)
    {
        var profiles = await repo.GetProfilesAsync(ids, token);

        return profiles.Select(e => new EducatorResponse(e.UserId, e.FirstName, e.LastName, e.ImageUrl)).ToDictionary(e => e.Id, e => e);
    }

    public async Task UpdateProfileAsync(ProfileSummary profile, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(profile);

        var dbProfile = await repo.GetProfileAsync(profile.UserId, token);
        if (dbProfile == null)
        {
            await repo.AddProfileAsync(profile, token);
            return;
        }

        dbProfile.FirstName = profile.FirstName;
        dbProfile.LastName = profile.LastName;
        dbProfile.ImageUrl = profile.ImageUrl;

        await repo.UpdateProfileAsync(profile, token);
    }
}