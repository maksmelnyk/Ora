package com.example.profile.features.userProfile.contracts;

import java.time.LocalDate;
import java.util.UUID;

public record ProfileDetailsResponse(
        UUID id,
        String firstName,
        String lastName,
        String bio,
        String imageUrl,
        LocalDate birthDate,
        ProfileEducatorDetailsResponse educator) {
}