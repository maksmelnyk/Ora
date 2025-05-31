package com.example.profile.features.educatorProfile;

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

    public EducatorSummaryResponse toEducatorSummary(EducatorProfile profile) {
        return new EducatorSummaryResponse(
                profile.getId(),
                profile.getUserProfile().getFirstName(),
                profile.getUserProfile().getLastName(),
                profile.getUserProfile().getImageUrl(),
                profile.getBio());
    }

    public EducatorDetailsResponse toEducatorDetails(EducatorProfile profile) {
        return new EducatorDetailsResponse(
                profile.getId(),
                profile.getUserProfile().getFirstName(),
                profile.getUserProfile().getLastName(),
                profile.getUserProfile().getImageUrl(),
                profile.getVideoUrl(),
                profile.getBio(),
                profile.getExperience());
    }
}