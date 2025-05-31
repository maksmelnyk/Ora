package com.example.profile.features.userProfile.contracts;

import java.util.UUID;

public record ProfileDetailsResponse(
        UUID id,
        String username,
        String firstName,
        String lastName,
        String bio,
        String imageUrl,
        ProfileEducatorDetailsResponse educator) {
}