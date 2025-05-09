package com.example.profile.features.userProfile.contracts;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record UpdateUserProfileRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Past LocalDate birthDate,
        String bio,
        String imageUrl) {
}