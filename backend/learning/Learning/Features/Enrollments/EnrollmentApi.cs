namespace Learning.Features.Enrollments;

public static class EnrollmentApi
{
    public static void MapEnrollmentEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var sessionGroup = endpoints.MapGroup("api/v1/enrollments").RequireAuthorization();

        sessionGroup.MapPost("{sessionId:long}", async (long sessionId, CancellationToken token, IEnrollmentService service) =>
        {
            await service.AddEnrollmentAsync(sessionId, token);
            return Results.Created();
        }).WithName("AddEnrollment")
          .Produces(StatusCodes.Status201Created);
    }
}