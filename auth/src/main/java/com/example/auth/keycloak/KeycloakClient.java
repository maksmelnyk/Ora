package com.example.auth.keycloak;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.Response;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.auth.RegisterRequest;
import com.example.auth.exception.AuthenticationException;
import com.example.auth.exception.ErrorCodes;
import com.example.auth.exception.ValidationException;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class KeycloakClient {

    private final Keycloak keycloak;
    private final KeycloakProperties properties;
    private final RestTemplate restTemplate;

    public String registerUser(RegisterRequest request) {
        if (isEmailExists(request.email())) {
            throw new ValidationException("Email already exists", ErrorCodes.EMAIL_ALREADY_EXISTS);
        }

        if (isUsernameExists(request.username())) {
            throw new ValidationException("Username already exists", ErrorCodes.USERNAME_ALREADY_EXISTS);
        }

        UserRepresentation user = createUserRepresentation(request);

        Response response = keycloak.realm(properties.getRealm()).users().create(user);
        if (response.getStatus() != HttpStatus.CREATED.value()) {
            throw new AuthenticationException("Failed to create user", ErrorCodes.USER_CREATION_FAILED);
        }

        String userId = extractUserIdFromResponse(response);

        assignRoleToUser(userId, KeycloakRole.USER);

        return userId;
    }

    public void assignRoleToUser(String userId, String roleName) {
        try {
            RoleRepresentation role = keycloak.realm(properties.getRealm()).roles().get(roleName).toRepresentation();

            keycloak.realm(properties.getRealm())
                    .users()
                    .get(userId)
                    .roles()
                    .realmLevel()
                    .add(Collections.singletonList(role));
        } catch (Exception e) {
            throw new AuthenticationException("Failed to assign user role", ErrorCodes.USER_ROLE_ASSIGNMENT_FAILED, e);
        }
    }

    public Map<String, Object> loginUser(String username, String password) {
        String url = String.format("%s/realms/%s/protocol/openid-connect/token", properties.getUrl(),
                properties.getRealm());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", properties.getClientId());
        form.add("client_secret", properties.getClientSecret());
        form.add("grant_type", "password");
        form.add("username", username);
        form.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new AuthenticationException("Failed to login user", ErrorCodes.USER_LOGIN_FAILED);
            }

            return response.getBody();
        } catch (Exception e) {
            throw new AuthenticationException("Error during user login", ErrorCodes.USER_LOGIN_ERROR, e);
        }
    }

    private boolean isEmailExists(String email) {
        List<UserRepresentation> users = keycloak.realm(properties.getRealm())
                .users()
                .search(null, null, null, email, 0, 1);

        return users != null && !users.isEmpty();
    }

    private boolean isUsernameExists(String username) {
        List<UserRepresentation> users = keycloak.realm(properties.getRealm())
                .users()
                .search(username, null, null, null, 0, 1);

        return users != null && !users.isEmpty();
    }

    private UserRepresentation createUserRepresentation(RegisterRequest request) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(request.username());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setEmailVerified(true);
        user.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.password());
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
