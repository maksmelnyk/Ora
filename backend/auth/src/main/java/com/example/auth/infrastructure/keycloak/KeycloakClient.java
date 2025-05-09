package com.example.auth.infrastructure.keycloak;

import jakarta.ws.rs.core.Response;
import lombok.AllArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import com.example.auth.exceptions.AuthenticationException;
import com.example.auth.exceptions.ErrorCodes;
import com.example.auth.exceptions.ValidationException;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class KeycloakClient {

    private final Keycloak keycloak;
    private final KeycloakProperties properties;

    public UUID registerUser(String username, String email, String password) {
        if (isEmailExists(email)) {
            throw new ValidationException("Email already exists", ErrorCodes.EMAIL_ALREADY_EXISTS);
        }

        if (isUsernameExists(username)) {
            throw new ValidationException("Username already exists", ErrorCodes.USERNAME_ALREADY_EXISTS);
        }

        UserRepresentation user = createUserRepresentation(username, email, password);

        Response response = this.keycloak.realm(this.properties.getRealm()).users().create(user);
        if (response.getStatus() != HttpStatus.CREATED.value()) {
            throw new AuthenticationException("Failed to create user", ErrorCodes.USER_CREATION_FAILED);
        }

        String userId = extractUserIdFromResponse(response);

        assignRoleToUser(userId, KeycloakRole.USER);

        return UUID.fromString(userId);
    }

    public void enableUser(UUID userId) {
        try {
            UserResource userResource = this.keycloak.realm(this.properties.getRealm())
                    .users().get(userId.toString());

            UserRepresentation user = userResource.toRepresentation();
            user.setEnabled(true);
            userResource.update(user);
        } catch (Exception e) {
            throw new AuthenticationException("Failed to enable user", ErrorCodes.USER_UPDATE_FAILED, e);
        }
    }

    public UserStatus getUserStatus(UUID userId) {
        try {
            UserResource userResource = this.keycloak.realm(this.properties.getRealm())
                    .users().get(userId.toString());

            UserRepresentation user = userResource.toRepresentation();

            return user.isEnabled() ? UserStatus.ENABLED : UserStatus.DISABLED;
        } catch (Exception e) {
            return UserStatus.NOT_FOUND;
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
        } catch (Exception e) {
            throw new AuthenticationException("Failed to assign user role", ErrorCodes.USER_ROLE_ASSIGNMENT_FAILED, e);
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