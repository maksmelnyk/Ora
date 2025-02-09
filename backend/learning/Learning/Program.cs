using FluentValidation;
using Learning.Data;
using Learning.Features.Enrollments;
using Learning.Features.Sessions;
using Learning.Infrastructure.Identity;
using Learning.Infrastructure.Keycloak;
using Learning.Infrastructure.Logging;
using Learning.Middlewares;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddCors();
builder.Services.AddHttpContextAccessor();

var logOptions = builder.Configuration.GetSection(nameof(LogOptions)).Get<LogOptions>() ?? new LogOptions();
ArgumentNullException.ThrowIfNull(logOptions);

builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration.ReadFrom.Configuration(context.Configuration)
                .ReadFrom.Services(services)
                .Enrich.FromLogContext()
                .Enrich.WithProperty("service_name", logOptions.ServiceName)
                .WriteTo.Console(restrictedToMinimumLevel: LogEventLevel.Information)
                .WriteTo.Logger(lc => lc
                    .Filter.ByExcluding(logEvent =>
                        logEvent.Properties.TryGetValue("SourceContext", out var sourceContext) &&
                        (sourceContext.ToString().Contains("Microsoft") ||
                         sourceContext.ToString().Contains("System")) &&
                        logEvent.Level < LogEventLevel.Warning
                    )
                    .WriteTo.File(
                        formatter: new SnakeCaseLogJsonFormatter(),
                        path: logOptions.LogFilePath,
                        rollingInterval: RollingInterval.Day,
                        fileSizeLimitBytes: logOptions.LogFileSizeLimitBytes
                    )
                );
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        var keycloakOptions = builder.Configuration.GetSection(nameof(KeycloakOptions)).Get<KeycloakOptions>();
        ArgumentNullException.ThrowIfNull(keycloakOptions);

        o.Authority = keycloakOptions.Authority;
        o.Audience = keycloakOptions.Audience;
        o.RequireHttpsMetadata = false;

        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = keycloakOptions.Authority,
            ValidAudience = keycloakOptions.Audience,
            RoleClaimType = keycloakOptions.RoleAddress
        };

        o.MetadataAddress = keycloakOptions.MetadataAddress;
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(AuthorizationPolicies.RequireTeacherRole, p => p.RequireClaim(ClaimTypes.Role, KeycloakRoles.TeacherRole))
    .SetFallbackPolicy(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());

builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddScoped<IClaimsTransformation, KeycloakClaimsTransformer>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();
app.UseMiddleware<LoggingMiddleware>();
app.UseSerilogRequestLogging();
app.UseAuthentication();
app.UseAuthorization();
app.MapSessionEndpoints();
app.MapEnrollmentEndpoints();

app.Run();