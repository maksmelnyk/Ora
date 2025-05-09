package com.example.auth.contracts;

import jakarta.validation.constraints.NotEmpty;

public record RegistrationStatusRequest(@NotEmpty String token) {
}
