namespace Learning.Infrastructure.Keycloak;

public class KeycloakSettings
{
    public string Authority { get; set; }
    public string Audience { get; set; }
    public string RoleAddress { get; set; }
    public string MetadataAddress { get; set; }
}