using System.Security.Claims;
using FluentValidation;
using Learning.Data;
using Learning.Features.Enrollments;
using Learning.Features.Sessions;
using Learning.Features.Sessions.Contracts;
using Learning.Infrastructure.Identity;
using Learning.Infrastructure.Keycloak;
using Learning.Middlewares;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddCors();

var keycloakSettings = new KeycloakSettings();
builder.Configuration.Bind(nameof(KeycloakSettings), keycloakSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.Authority = keycloakSettings.Authority;
        o.Audience = keycloakSettings.Audience;
        o.RequireHttpsMetadata = true;
        o.RequireHttpsMetadata = false;

        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = keycloakSettings.Authority,
            ValidAudience = keycloakSettings.Audience,
            RoleClaimType = keycloakSettings.RoleAddress
        };

        o.MetadataAddress = keycloakSettings.MetadataAddress;
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(AuthorizationPolicies.RequireTeacherRole, p => p.RequireClaim(ClaimTypes.Role, KeycloakRoles.TeacherRole))
    .SetFallbackPolicy(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());

builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddScoped<IClaimsTransformation, KeycloakClaimsTransformer>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddSingleton<IValidator<SessionRequest>, SessionRequestValidator>();
builder.Services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapSessionEndpoints();
app.MapEnrollmentEndpoints();

app.Run();