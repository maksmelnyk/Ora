package com.example.profile.features.userProfile.contracts;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserProfileRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        String bio,
        String imageUrl) {
}