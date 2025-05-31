package com.example.profile.features.userProfile;

import java.util.Random;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.example.profile.features.educatorProfile.entities.EducatorProfile;
import com.example.profile.features.userProfile.contracts.ProfileDetailsResponse;
import com.example.profile.features.userProfile.contracts.ProfileEducatorDetailsResponse;
import com.example.profile.features.userProfile.contracts.UpdateUserProfileRequest;
import com.example.profile.features.userProfile.entities.UserProfile;
import com.example.profile.infrastructure.messaging.events.EducatorProfileUpdatedEvent;
import com.example.profile.infrastructure.messaging.events.RegistrationInitiatedEvent;

@Component
public class UserProfileMapper {
    public UserProfile toUserProfile(RegistrationInitiatedEvent request) {
        if (request == null) {
            return null;
        }

        return UserProfile.builder()
                .id(UUID.fromString(request.getUserId()))
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .birthDate(request.getBirthDate())
                .build();
    }

    public ProfileDetailsResponse toProfileDetails(UserProfile profile, EducatorProfile educator, Random random) {
        return new ProfileDetailsResponse(
                profile.getId(),
                profile.getUsername(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getBio(),
                profile.getImageUrl(),
                toProfileEducatorDetails(educator, random));
    }

    // TODO: map real counters
    public ProfileEducatorDetailsResponse toProfileEducatorDetails(EducatorProfile educator, Random random) {
        if (educator == null) {
            return null;
        }

        return new ProfileEducatorDetailsResponse(
                educator.getBio(),
                educator.getExperience(),
                educator.getVideoUrl(),
                Math.round(1.0 + (5.0 - 1.0) * random.nextDouble() * 10.0) / 10.0,
                random.nextInt(0, 20),
                random.nextInt(0, 20));
    }

    public void mapUserProfile(UpdateUserProfileRequest source, UserProfile target) {
        if (source == null || target == null) {
            return;
        }

        target.setFirstName(source.firstName());
        target.setLastName(source.lastName());
        target.setImageUrl(source.imageUrl());
    }

    public EducatorProfileUpdatedEvent toProfileUpdatedEvent(UserProfile request) {
        if (request == null) {
            return null;
        }

        return new EducatorProfileUpdatedEvent(
                request.getId().toString(),
                request.getFirstName(),
                request.getLastName(),
                request.getImageUrl());
    }
}