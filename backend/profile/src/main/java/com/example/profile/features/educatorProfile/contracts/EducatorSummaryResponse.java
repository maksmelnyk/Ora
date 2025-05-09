package com.example.profile.features.educatorProfile.contracts;

import java.util.UUID;

public record EducatorSummaryResponse(UUID id, String firstName, String lastName, String imageUrl, String bio) {
}