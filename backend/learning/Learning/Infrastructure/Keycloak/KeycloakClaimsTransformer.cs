using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Text.Json;

namespace Learning.Infrastructure.Keycloak;

public class KeycloakClaimsTransformer : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is ClaimsIdentity identity)
        {
            if (!identity.HasClaim(c => c.Type == "role"))
            {
                var realmAccessClaim = identity.FindFirst("realm_access")?.Value;

                if (!string.IsNullOrEmpty(realmAccessClaim))
                {
                    var roles = JsonDocument.Parse(realmAccessClaim)
                        .RootElement.GetProperty("roles")
                        .EnumerateArray()
                        .Select(role => role.GetString())
                        .Where(role => role != null);

                    foreach (var role in roles)
                    {
                        identity.AddClaim(new Claim(ClaimTypes.Role, role!));
                    }
                }
            }
        }

        return Task.FromResult(principal);
    }
}
