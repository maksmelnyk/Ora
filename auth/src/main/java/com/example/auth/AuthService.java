package com.example.auth;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.auth.keycloak.KeycloakClient;
import com.example.auth.rabbitmq.UserCreationEvent;
import com.example.auth.rabbitmq.UserCreationEvent.UserCreationStatus;
import com.example.auth.rabbitmq.UserPublisherService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {
    private final KeycloakClient keycloakClient;
    private final UserPublisherService publisherService;

    public Map<String, Object> register(RegisterRequest request) {
        String userId = keycloakClient.registerUser(request.username(), request.email(), request.password());

        UserCreationEvent event = UserCreationEvent.builder()
                .userId(userId)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .birthDate(request.birthDate())
                .build();

        try {
            UserCreationStatus response = publisherService.createUserWithValidation(event);
            if (response != UserCreationStatus.CREATED) {
                keycloakClient.deleteUser(userId);
            }
        } catch (Exception e) {
            keycloakClient.deleteUser(userId);
            throw e;
        }

        return keycloakClient.loginUser(request.email(), request.password());
    }
}