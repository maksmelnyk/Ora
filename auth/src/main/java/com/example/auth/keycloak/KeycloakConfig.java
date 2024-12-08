package com.example.auth.keycloak;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class KeycloakConfig {
    private final KeycloakProperties keycloakProperties;

    @Bean
    Keycloak keycloakInstance() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakProperties.getUrl())
                .realm("master")
                .clientId(keycloakProperties.getAdminClientId())
                .username(keycloakProperties.getAdminUsername())
                .password(keycloakProperties.getAdminPassword())
                .build();
    }
}