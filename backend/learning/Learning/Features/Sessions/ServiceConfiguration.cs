namespace Learning.Features.Sessions;

public static class ServiceConfiguration
{
    public static void AddSessions(this IServiceCollection services)
    {
        services.AddScoped<ISessionRepository, SessionRepository>();
        services.AddScoped<ISessionService, SessionService>();
    }
}