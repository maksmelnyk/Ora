package com.example.auth.features;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.auth.features.contracts.RegistrationRequest;
import com.example.auth.features.contracts.RegistrationResponse;
import com.example.auth.features.contracts.RegistrationState;
import com.example.auth.features.contracts.RegistrationStatusRequest;
import com.example.auth.features.contracts.RegistrationStatusResponse;
import com.example.auth.infrastructure.jwt.JwtService;
import com.example.auth.infrastructure.keycloak.KeycloakClient;
import com.example.auth.infrastructure.keycloak.KeycloakRole;
import com.example.auth.infrastructure.keycloak.KeycloakClient.UserStatus;
import com.example.auth.infrastructure.messaging.events.RegistrationInitiatedEvent;
import com.example.auth.infrastructure.messaging.publishers.EventPublisher;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final KeycloakClient keycloakClient;
    private final EventPublisher eventPublisher;

    public RegistrationResponse register(RegistrationRequest request) {
        UUID userId = this.keycloakClient.registerUser(request.username(), request.email(), request.password());

        eventPublisher.publishRegistrationInitiated(new RegistrationInitiatedEvent(
                userId.toString(),
                request.email(),
                request.firstName(),
                request.lastName(),
                request.birthDate()));

        String statusToken = jwtService.generateStatusToken(userId);

        return new RegistrationResponse(statusToken, request.username());
    }

    public RegistrationStatusResponse checkStatus(RegistrationStatusRequest request) {
        UUID userId = jwtService.validateStatusTokenAndGetUserId(request.token());

        UserStatus userExists = keycloakClient.getUserStatus(userId);

        if (userExists.equals(UserStatus.NOT_FOUND)) {
            return new RegistrationStatusResponse(RegistrationState.FAILED, "Registration failed or was canceled");
        }

        if (userExists.equals(UserStatus.ENABLED)) {
            return new RegistrationStatusResponse(RegistrationState.COMPLETED, null);
        }

        return new RegistrationStatusResponse(RegistrationState.PENDING, null);
    }

    public void finalizeUserCreation(String userIdStr, Boolean isSuccess) {
        UUID userId = UUID.fromString(userIdStr);

        if (isSuccess) {
            keycloakClient.enableUser(userId);
        } else {
            keycloakClient.deleteUser(userId);
        }
    }

    public void assignEducatorRoleToUser(String userId) {
        keycloakClient.assignRoleToUser(userId, KeycloakRole.EDUCATOR);
    }
}