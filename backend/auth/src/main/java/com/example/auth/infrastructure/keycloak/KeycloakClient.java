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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.auth.exceptions.AuthenticationException;
import com.example.auth.exceptions.ErrorCodes;
import com.example.auth.exceptions.ValidationException;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class KeycloakClient {

    private final Keycloak keycloak;
    private final KeycloakProperties properties;
    private final RestTemplate template;

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

    public Map<String, Object> loginUser(String username, String password) {
        String url = String.format("%s/realms/%s/protocol/openid-connect/token", this.properties.getUrl(),
                this.properties.getRealm());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", this.properties.getClientId());
        form.add("client_secret", this.properties.getClientSecret());
        form.add("grant_type", "password");
        form.add("username", username);
        form.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        try {
            ResponseEntity<Map> response = this.template.postForEntity(url, request, Map.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new AuthenticationException("Failed to login user", ErrorCodes.USER_LOGIN_FAILED);
            }

            return response.getBody();
        } catch (Exception e) {
            throw new AuthenticationException("Error during user login", ErrorCodes.USER_LOGIN_ERROR, e);
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
        user.setEnabled(true);

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
}