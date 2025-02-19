namespace Learning.Features.Enrollments;

public static class ServiceConfiguration
{
    public static void AddEnrollments(this IServiceCollection services)
    {
        services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
    }
}