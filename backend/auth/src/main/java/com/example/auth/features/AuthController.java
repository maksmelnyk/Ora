package com.example.auth.features;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.features.contracts.RegistrationRequest;
import com.example.auth.features.contracts.RegistrationResponse;
import com.example.auth.features.contracts.RegistrationStatusRequest;
import com.example.auth.features.contracts.RegistrationStatusResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth", description = "Authentication APIs")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @Operation(summary = "Register a New User", description = "Creates a new user account based on the provided credentials and profile information")
    @PostMapping("/register")
    @ApiResponse(responseCode = "200", description = "User registered successfully")
    public ResponseEntity<RegistrationResponse> register(@RequestBody @Valid RegistrationRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @Operation(summary = "Check Registration Status", description = "Verifies the current status of a user's registration process")
    @PostMapping("/status")
    @ApiResponse(responseCode = "200", description = "Registration status checked successfully")
    public ResponseEntity<RegistrationStatusResponse> checkStatus(
            @RequestBody @Valid RegistrationStatusRequest request) {
        return ResponseEntity.ok(service.checkStatus(request));
    }
}