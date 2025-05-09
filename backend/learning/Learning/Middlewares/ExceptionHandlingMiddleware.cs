using System.Net;
using FluentValidation;
using Learning.Exceptions;

namespace Learning.Middlewares;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            await WriteErrorResponse(
                context,
                "Validation failed",
                "ERROR_VALIDATION",
                (int)HttpStatusCode.UnprocessableEntity,
                ex.Errors
            );
        }
        catch (ResourceNotFoundException ex)
        {
            await WriteErrorResponse(context, ex.Message, ex.ErrorCode, (int)HttpStatusCode.NotFound);
        }
        catch (InvalidRequestException ex)
        {
            await WriteErrorResponse(context, ex.Message, ex.ErrorCode, (int)HttpStatusCode.BadRequest);
        }
        catch (ForbiddenException ex)
        {
            await WriteErrorResponse(context, ex.Message, ex.ErrorCode, (int)HttpStatusCode.Forbidden);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Request failed: ");
            await WriteErrorResponse(context, "Unhandled exception occurred", "ERROR_INTERNAL_SERVER", (int)HttpStatusCode.InternalServerError);
        }
    }

    private async Task WriteErrorResponse(
        HttpContext context,
        string errorMessage,
        string errorCode,
        int statusCode,
        IEnumerable<object> errors = null
    )
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new
        {
            StatusCode = statusCode,
            ErrorCode = errorCode,
            ErrorMessage = errorMessage,
            Details = errors
        };
        await context.Response.WriteAsJsonAsync(response);
    }
}