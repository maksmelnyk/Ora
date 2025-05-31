package com.example.profile.features.userProfile.contracts;

public record ProfileEducatorDetailsResponse(
        String bio,
        String experience,
        String videoUrl,
        double rating,
        int studentCount,
        int productCount) {
}