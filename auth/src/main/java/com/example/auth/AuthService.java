package com.example.auth;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.auth.keycloak.KeycloakClient;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {
    private final KeycloakClient keycloakClient;

    public Map<String, Object> registerUser(RegisterRequest request) {
        keycloakClient.registerUser(request);
        return keycloakClient.loginUser(request.email(), request.password());
    }
}
