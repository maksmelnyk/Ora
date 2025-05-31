package com.example.profile.features.educatorProfile;

import java.util.Random;

import org.springframework.stereotype.Component;

import com.example.profile.features.educatorProfile.contracts.EducatorDetailsResponse;
import com.example.profile.features.educatorProfile.contracts.EducatorSummaryResponse;
import com.example.profile.features.educatorProfile.contracts.UpdateEducatorProfileRequest;
import com.example.profile.features.educatorProfile.entities.EducatorProfile;

@Component
public class EducatorProfileMapper {
    public EducatorProfile toEducatorProfile(UpdateEducatorProfileRequest request) {
        if (request == null) {
            return null;
        }

        return EducatorProfile.builder()
                .bio(request.bio())
                .experience(request.experience())
                .videoUrl(request.videoUrl())
                .hasProduct(false)
                .build();
    }

    // TODO: map real counters
    public EducatorSummaryResponse toEducatorSummary(EducatorProfile profile, Random random) {
        return new EducatorSummaryResponse(
                profile.getId(),
                profile.getUserProfile().getFirstName(),
                profile.getUserProfile().getLastName(),
                profile.getUserProfile().getImageUrl(),
                profile.getBio(),
                Math.round(1.0 + (5.0 - 1.0) * random.nextDouble() * 10.0) / 10.0,
                random.nextInt(0, 20),
                random.nextInt(0, 20));
    }

    // TODO: map real counters
    public EducatorDetailsResponse toEducatorDetails(EducatorProfile profile, Random random) {
        return new EducatorDetailsResponse(
                profile.getId(),
                profile.getUserProfile().getFirstName(),
                profile.getUserProfile().getLastName(),
                profile.getUserProfile().getImageUrl(),
                profile.getVideoUrl(),
                profile.getBio(),
                profile.getExperience(),
                Math.round(1.0 + (5.0 - 1.0) * random.nextDouble() * 10.0) / 10.0,
                random.nextInt(0, 20),
                random.nextInt(0, 20));
    }
}