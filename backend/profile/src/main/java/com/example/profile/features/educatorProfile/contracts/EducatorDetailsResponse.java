package com.example.profile.features.educatorProfile.contracts;

import java.util.UUID;

public record EducatorDetailsResponse(
        UUID id,
        String firstName,
        String lastName,
        String imageUrl,
        String videoUrl,
        String bio,
        String experience) {
}
