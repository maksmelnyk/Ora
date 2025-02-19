package com.example.profile.features.userProfile;

import java.time.LocalDate;

public record UserProfileResponse(
        Long id, String firstName,
        String lastName,
        LocalDate birthDate) {
}