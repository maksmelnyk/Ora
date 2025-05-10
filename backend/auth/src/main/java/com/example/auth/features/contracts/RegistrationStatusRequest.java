package com.example.auth.features.contracts;

import jakarta.validation.constraints.NotEmpty;

public record RegistrationStatusRequest(@NotEmpty String token) {
}
