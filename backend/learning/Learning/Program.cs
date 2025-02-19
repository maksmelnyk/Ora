using FluentValidation;
using Learning.Data;
using Learning.Features.Enrollments;
using Learning.Features.Sessions;
using Learning.Infrastructure.Identity;
using Learning.Infrastructure.Keycloak;
using Learning.Infrastructure.Telemetry;
using Learning.Middlewares;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddCors();
builder.Services.AddHttpContextAccessor();

var telemetryOptions = builder.Configuration.GetSection(nameof(TelemetryOptions)).Get<TelemetryOptions>();
ArgumentNullException.ThrowIfNull(telemetryOptions);

if (telemetryOptions.OtelTelemetryEnabled())
{
    builder.Services.AddTelemetry(telemetryOptions);
}
builder.Host.ConfigureSerilog(telemetryOptions);

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

builder.Services.AddEnrollments();
builder.Services.AddSessions();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();
app.UseMiddleware<LoggingMiddleware>();
app.UseSerilogRequestLogging();
app.MapPrometheusScrapingEndpoint();
app.UseAuthentication();
app.UseAuthorization();
app.MapSessionEndpoints();
app.MapEnrollmentEndpoints();

app.Run();

