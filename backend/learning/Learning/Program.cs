using FluentValidation;
using Learning.Features.Categories;
using Learning.Features.Enrollments;
using Learning.Features.Products;
using Learning.Features.Profiles;
using Learning.Infrastructure.Data;
using Learning.Infrastructure.Identity;
using Learning.Infrastructure.Keycloak;
using Learning.Infrastructure.Messaging.RabbitMq;
using Learning.Infrastructure.OpenApi;
using Learning.Infrastructure.Telemetry;
using Learning.Middleware;
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
builder.Services.AddOpenApi(o => { o.AddDocumentTransformer<BearerSecuritySchemeTransformer>(); });

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
    .AddPolicy(AuthorizationPolicies.RequireEducatorRole, p => p.RequireClaim(ClaimTypes.Role, KeycloakRoles.EducatorRole))
    .SetFallbackPolicy(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);
builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());

builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

builder.Services.AddRabbitMq(builder.Configuration);

builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddScoped<IClaimsTransformation, KeycloakClaimsTransformer>();

builder.Services.AddEnrollments();
builder.Services.AddProducts();
builder.Services.AddProfiles();
builder.Services.AddCategories();

var app = builder.Build();

const string openApiUrl = "/openapi/v1/openapi.json";
// TODO: temporary allow OpenAPI docs APIs
app.MapOpenApi(openApiUrl).AllowAnonymous();
app.UseSwaggerUI(o => { o.SwaggerEndpoint(openApiUrl, "v1"); });

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();
app.UseMiddleware<LoggingMiddleware>();
app.UseSerilogRequestLogging();
app.MapPrometheusScrapingEndpoint();
app.UseAuthentication();
app.UseAuthorization();
app.MapCategoryEndpoints();
app.MapProductEndpoints();
app.MapEnrollmentEndpoints();

app.Run();
