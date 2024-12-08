package com.example.profile.userProfile;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

public record UpdateUserProfileRequest(
        @NotBlank
        String firstName,
        @NotBlank
        String lastName,
        @Past
        LocalDate birthDate) {
}