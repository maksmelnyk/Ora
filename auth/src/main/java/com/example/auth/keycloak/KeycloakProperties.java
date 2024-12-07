package com.example.auth.keycloak;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {
    private String url;
    private String realm;
    private String clientId;
    private String clientSecret;
    private String adminClientId;
    private String adminUsername;
    private String adminPassword;
}
