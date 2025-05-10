package com.example.auth.features.contracts;

public record RegistrationStatusResponse(RegistrationState state, String errorMessage) {
}