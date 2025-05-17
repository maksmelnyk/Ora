package com.example.auth.infrastructure.keycloak;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.auth.exceptions.ConflictException;
import com.example.auth.exceptions.ErrorCodes;
import com.example.auth.exceptions.NotFoundException;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class KeycloakClient {
    private final Keycloak keycloak;
    private final KeycloakProperties properties;

    public UUID registerUser(String username, String email, String password) {
        if (isEmailExists(email)) {
            log.error("Email already exists: {}", email);
            throw new ConflictException("Invalid registration details", ErrorCodes.INVALID_REGISTRATION_DETAILS);
        }

        if (isUsernameExists(username)) {
            log.error("Username already exists: {}", username);
            throw new ConflictException("Invalid registration details", ErrorCodes.INVALID_REGISTRATION_DETAILS);
        }

        UserRepresentation user = createUserRepresentation(username, email, password);

        try {
            Response response = this.keycloak.realm(this.properties.getRealm()).users().create(user);
            if (response.getStatus() == HttpStatus.CONFLICT.value()) {
                throw new ConflictException("User already exists in Keycloak", ErrorCodes.USER_CREATION_FAILED);
            } else if (response.getStatus() != HttpStatus.CREATED.value()) {
                throw new RuntimeException("Unexpected response from Keycloak: " + response.getStatus());
            }

            String userId = extractUserIdFromResponse(response);
            assignRoleToUser(userId, KeycloakRole.USER);

            return UUID.fromString(userId);
        } catch (WebApplicationException e) {
            if (e.getResponse().getStatus() == 409) {
                log.error("User already exists in Keycloak: {}", e.getMessage(), e);
                throw new ConflictException("User already exists in Keycloak", ErrorCodes.USER_CREATION_FAILED);
            }
            log.error("Unexpected error during user registration", e);
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error during user registration", e);
            throw e;
        }
    }

    public void enableUser(UUID userId) {
        try {
            UserResource userResource = this.keycloak.realm(this.properties.getRealm())
                    .users().get(userId.toString());

            UserRepresentation user = userResource.toRepresentation();
            user.setEnabled(true);
            userResource.update(user);
        } catch (jakarta.ws.rs.NotFoundException e) {
            log.error("User not found: {}", userId, e);
            throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND);
        } catch (Exception e) {
            log.error("Unexpected error during user registration", e);
            throw e;
        }
    }

    public UserStatus getUserStatus(UUID userId) {
        try {
            UserResource userResource = this.keycloak.realm(this.properties.getRealm())
                    .users().get(userId.toString());

            UserRepresentation user = userResource.toRepresentation();

            return user.isEnabled() ? UserStatus.ENABLED : UserStatus.DISABLED;
        } catch (jakarta.ws.rs.NotFoundException e) {
            return UserStatus.NOT_FOUND;
        } catch (Exception e) {
            log.error("Unexpected error during user registration", e);
            throw e;
        }
    }

    public void assignRoleToUser(String userId, String roleName) {
        try {
            RoleRepresentation role = this.keycloak.realm(this.properties.getRealm()).roles().get(roleName)
                    .toRepresentation();

            this.keycloak.realm(this.properties.getRealm())
                    .users()
                    .get(userId)
                    .roles()
                    .realmLevel()
                    .add(Collections.singletonList(role));
        } catch (jakarta.ws.rs.NotFoundException e) {
            log.error("User not found: {}", userId, e);
            throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND);
        } catch (Exception e) {
            log.error("Unexpected error during user registration", e);
            throw e;
        }
    }

    public void deleteUser(UUID userId) {
        UserResource userResource = this.keycloak.realm(this.properties.getRealm()).users().get(userId.toString());

        if (userResource != null) {
            userResource.remove();
        }
    }

    private boolean isEmailExists(String email) {
        List<UserRepresentation> users = this.keycloak.realm(this.properties.getRealm())
                .users()
                .search(null, null, null, email, 0, 1);

        return users != null && !users.isEmpty();
    }

    private boolean isUsernameExists(String username) {
        List<UserRepresentation> users = this.keycloak.realm(this.properties.getRealm())
                .users()
                .search(username, null, null, null, 0, 1);

        return users != null && !users.isEmpty();
    }

    private UserRepresentation createUserRepresentation(String username, String email, String password) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEmailVerified(true);
        user.setEnabled(false);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);

        user.setCredentials(Collections.singletonList(credential));
        return user;
    }

    private String extractUserIdFromResponse(Response response) {
        return response.getLocation()
                .getPath()
                .replaceAll(".*/([^/]+)$", "$1");
    }

    public enum UserStatus {
        NOT_FOUND,
        DISABLED,
        ENABLED
    }
}