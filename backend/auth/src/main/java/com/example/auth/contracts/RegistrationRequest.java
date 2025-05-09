package com.example.auth.contracts;

import java.time.LocalDate;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
        @NotEmpty @Size(min = 3, max = 20) String username,
        @NotEmpty @Size(min = 1, max = 50) String firstName,
        @NotEmpty @Size(min = 1, max = 50) String lastName,
        @NotEmpty @Size(max = 254) @Email String email,
        @NotEmpty @Size(min = 8, max = 128) String password,
        @NonNull @Past LocalDate birthDate) {
}