package com.example.auth.keycloak;

import lombok.AllArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class KeycloakConfig {
    private final KeycloakProperties properties;

    @Bean
    Keycloak keycloakInstance() {
        return KeycloakBuilder.builder()
                .serverUrl(this.properties.getUrl())
                .realm("master")
                .clientId(this.properties.getAdminClientId())
                .username(this.properties.getAdminUsername())
                .password(this.properties.getAdminPassword())
                .build();
    }
}