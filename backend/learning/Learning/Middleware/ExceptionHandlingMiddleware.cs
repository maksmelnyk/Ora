using System.Net;
using FluentValidation;
using Learning.Exceptions;

namespace Learning.Middleware;

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
                HttpStatusCode.UnprocessableEntity,
                ex.Errors
            );
        }
        catch (NotFoundException ex)
        {
            await WriteErrorResponse(context, ex.Message, ex.Code, HttpStatusCode.NotFound);
        }
        catch (UnprocessableEntityException ex)
        {
            await WriteErrorResponse(context, ex.Message, ex.Code, HttpStatusCode.UnprocessableEntity);
        }
        catch (ForbiddenException ex)
        {
            await WriteErrorResponse(context, ex.Message, ex.Code, HttpStatusCode.Forbidden);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Request failed: ");
            await WriteErrorResponse(context, "Unhandled exception occurred", "ERROR_INTERNAL_SERVER", HttpStatusCode.InternalServerError);
        }
    }

    private async Task WriteErrorResponse(
        HttpContext context,
        string errorMessage,
        string errorCode,
        HttpStatusCode statusCode,
        IEnumerable<object> errors = null
    )
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var response = new
        {
            Code = errorCode,
            Message = errorMessage,
            Details = errors
        };
        await context.Response.WriteAsJsonAsync(response);
    }
}