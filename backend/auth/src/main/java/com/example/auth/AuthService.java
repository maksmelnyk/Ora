package com.example.auth;

import com.example.auth.keycloak.KeycloakClient;
import com.example.auth.rabbitmq.UserCreatedEvent;
import com.example.auth.rabbitmq.UserCreatedEvent.UserCreationStatus;
import com.example.auth.rabbitmq.UserCreatedEventPublisher;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthService {
    private final KeycloakClient keycloakClient;
    private final UserCreatedEventPublisher publisherService;

    public Map<String, Object> register(RegisterRequest request) {
        UUID userId = this.keycloakClient.registerUser(request.username(), request.email(), request.password());

        UserCreatedEvent event = UserCreatedEvent.builder()
                .userId(userId)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .birthDate(request.birthDate())
                .build();

        try {
            UserCreationStatus response = this.publisherService.publishUserCreationEvent(event);
            if (response != UserCreationStatus.CREATED) {
                this.keycloakClient.deleteUser(userId);
            }
        } catch (Exception e) {
            this.keycloakClient.deleteUser(userId);
            throw e;
        }

        return this.keycloakClient.loginUser(request.email(), request.password());
    }
}