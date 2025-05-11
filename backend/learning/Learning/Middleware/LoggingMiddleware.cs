using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;

namespace Learning.Middleware;

public class LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        using var scope = logger.BeginScope(new Dictionary<string, object>
        {
            ["request_id"] = Guid.NewGuid().ToString(),
            ["http_method"] = context.Request.Method,
            ["http_path"] = context.Request.Path.Value!,
            ["http_query"] = context.Request.QueryString.Value,
            ["client_ip"] = context.Connection.RemoteIpAddress?.ToString(),
            ["user_id"] = GetUserIdFromToken(context)
        });

        try
        {
            await next(context);
        }
        finally
        {
            stopwatch.Stop();

            using var finalScope = logger.BeginScope(new Dictionary<string, object>
            {
                ["status_code"] = context.Response.StatusCode,
                ["duration_ms"] = stopwatch.ElapsedMilliseconds
            });

            if (context.Response.StatusCode >= 500)
            {
                logger.LogError("Request completed with server error");
            }
            else if (context.Response.StatusCode >= 400)
            {
                logger.LogWarning("Request completed with user error");
            }
            else
            {
                logger.LogInformation("Request completed successfully");
            }
        }
    }

    private static string GetUserIdFromToken(HttpContext context)
    {
        var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

        if (!string.IsNullOrEmpty(token))
        {
            var handler = new JwtSecurityTokenHandler();
            if (handler.CanReadToken(token))
            {
                var jwtToken = handler.ReadJwtToken(token);
                return jwtToken?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value ?? "unknown";
            }
        }

        return "unknown";
    }
}