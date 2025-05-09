package com.example.profile.features.educatorProfile.contracts;

import jakarta.validation.constraints.NotBlank;

public record UpdateEducatorProfileRequest(@NotBlank String bio, @NotBlank String experience) {
}