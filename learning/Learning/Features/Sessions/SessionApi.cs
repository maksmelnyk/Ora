using Learning.Features.Sessions.Contracts;
using Learning.Infrastructure.Keycloak;

namespace Learning.Features.Sessions;

public static class SessionApi
{
	public static void MapSessionEndpoints(this IEndpointRouteBuilder endpoints)
	{
		var sessionGroup = endpoints.MapGroup("api/v1/sessions").RequireAuthorization();

		sessionGroup.MapGet(
			"{teacherId:guid}",
			async (Guid teacherId, int skip, int take, CancellationToken token, ISessionService service) =>
		{
			var courses = await service.GetTeacherSessionsAsync(teacherId, skip, take, token);
			return Results.Ok(courses);
		}).WithName("GetTeacherSessions")
		  .Produces<IEnumerable<SessionSummaryResponse>>(StatusCodes.Status200OK);

		sessionGroup.MapGet("my", async (int skip, int take, CancellationToken token, ISessionService service) =>
		{
			var courses = await service.GetMyEnrolledSessionsAsync(skip, take, token);
			return Results.Ok(courses);
		}).WithName("GetMyEnrolledSessions")
		  .Produces<IEnumerable<SessionSummaryResponse>>(StatusCodes.Status200OK);

		sessionGroup.MapGet("{id:long}", async (long id, CancellationToken token, ISessionService service) =>
		{
			var course = await service.GetSessionDetailsAsync(id, token);
			return course != null ? Results.Ok(course) : Results.NotFound();
		}).WithName("GetSessionDetails")
		  .Produces<SessionDetailsResponse>(StatusCodes.Status200OK)
		  .Produces(StatusCodes.Status404NotFound);

		sessionGroup.MapPost("", async (SessionRequest request, CancellationToken token, ISessionService service) =>
		{
			await service.CreateMySessionAsync(request, token);
			return Results.Created();
		}).WithName("CreateMySession")
		  .RequireAuthorization(AuthorizationPolicies.RequireTeacherRole)
		  .Produces(StatusCodes.Status201Created);

		sessionGroup.MapPut("{id:long}", async (long id, SessionRequest request, CancellationToken token, ISessionService service) =>
		{
			await service.UpdateMySessionAsync(id, request, token);
			return Results.NoContent();
		}).WithName("UpdateMySession")
		  .Produces(StatusCodes.Status204NoContent);

		sessionGroup.MapDelete("{id:long}", async (long id, CancellationToken token, ISessionService service) =>
		{
			await service.DeleteMySessionAsync(id, token);
			return Results.NoContent();
		}).WithName("DeleteMySession")
		  .Produces(StatusCodes.Status204NoContent);
	}
}
