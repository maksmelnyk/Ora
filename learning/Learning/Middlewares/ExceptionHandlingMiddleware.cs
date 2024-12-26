using System.Net;
using Learning.Exceptions;

namespace Learning.Middlewares;

public class ExceptionHandlingMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (FluentValidation.ValidationException ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var response = new
            {
                ErrorMessage = "Validation failed.",
                ErrorCode = "ERROR_VALIDATION",
                StatusCode = HttpStatusCode.BadRequest,
                Errors = ex.Errors.Select(err => new
                {
                    Field = err.PropertyName,
                    Message = err.ErrorMessage
                })
            };

            await context.Response.WriteAsJsonAsync(response);
        }
        catch (AppException ex)
        {
            context.Response.StatusCode = (int)ex.StatusCode;
            context.Response.ContentType = "application/json";
            var response = new
            {
                ex.ErrorMessage,
                ex.ErrorCode,
                ex.StatusCode
            };
            await context.Response.WriteAsJsonAsync(response);
        }
        catch (Exception)
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            var response = new
            {
                ErrorMessage = "An unexpected error occurred.",
                ErrorCode = "ERROR_INTERNAL_SERVER",
                StatusCode = HttpStatusCode.InternalServerError
            };
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
