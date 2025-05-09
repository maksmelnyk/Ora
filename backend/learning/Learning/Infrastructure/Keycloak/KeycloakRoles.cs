namespace Learning.Infrastructure.Keycloak;

public class KeycloakRoles
{
    public const string UserRole = "ROLE_USER";
    public const string EducatorRole = "ROLE_EDUCATOR";
    public const string AdminRole = "ROLE_ADMIN";
}

public class AuthorizationPolicies
{
    public const string RequireEducatorRole = "RequireEducatorRole";
}