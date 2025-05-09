package com.example.auth.contracts;

public record RegistrationStatusResponse(RegistrationState state, String errorMessage) {
}