namespace Learning.Infrastructure.Keycloak;

public class KeycloakRoles
{
    public const string UserRole = "ROLE_USER";
    public const string TeacherRole = "ROLE_TEACHER";
    public const string AdminRole = "ROLE_ADMIN";
}

public class AuthorizationPolicies
{
    public const string RequireTeacherRole = "RequireTeacherRole";
}