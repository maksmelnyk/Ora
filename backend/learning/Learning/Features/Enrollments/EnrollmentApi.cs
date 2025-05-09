using Learning.Features.Enrollments.Contracts;

namespace Learning.Features.Enrollments;

public static class EnrollmentApi
{
    public static void MapEnrollmentEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var sessionGroup = endpoints.MapGroup("api/v1/enrollments")
            .RequireAuthorization();

        sessionGroup.MapPost("/", async (
            EnrolledProductsRequest request,
            CancellationToken token,
            IEnrollmentService service) =>
        {
            var result = await service.GetMyEnrolledProductIds(request, token);
            return Results.Ok(result);
        })
        .WithName("GetMyEnrolledProductIds")
        .WithSummary("Retrieve Enrolled Product IDs")
        .WithDescription("Retrieves the collection of product IDs for which the authenticated user is enrolled.")
        .Produces(StatusCodes.Status200OK);

        sessionGroup.MapPost("/{id:long}/booking-metadata", async (
            long id,
            EnrollmentBookingMetadataRequest request,
            CancellationToken token,
            IEnrollmentService service) =>
        {
            var result = await service.GetEnrollmentBookingMetadataAsync(id, request, token);
            return Results.Ok(result);
        })
        .WithName("GetEnrollmentBookingMetadataAsync")
        .WithSummary("Get Enrollment Booking Metadata")
        .WithDescription("Retrieves information about whether a enrollment is valid for booking")
        .Produces(StatusCodes.Status200OK);
    }
}