using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Learning.Features.Enrollments;

public static class ServiceConfiguration
{
    public static void AddEnrollments(this IServiceCollection services)
    {
        services.TryAddScoped<IEnrollmentRepository, EnrollmentRepository>();
        services.TryAddScoped<IEnrollmentService, EnrollmentService>();
    }
}