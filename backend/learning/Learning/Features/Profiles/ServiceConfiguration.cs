using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Learning.Features.Profiles;

public static class ServiceConfiguration
{
    public static void AddProfiles(this IServiceCollection services)
    {
        services.TryAddScoped<IProfileRepository, ProfileRepository>();
        services.TryAddScoped<IProfileService, ProfileService>();
    }
}