package com.example.profile.features.userProfile;

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
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .birthDate(request.getBirthDate())
                .build();
    }

    public ProfileDetailsResponse toProfileDetails(UserProfile profile, EducatorProfile educator) {
        return new ProfileDetailsResponse(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getBio(),
                profile.getImageUrl(),
                profile.getBirthDate(),
                toProfileEducatorDetails(educator));
    }

    public ProfileEducatorDetailsResponse toProfileEducatorDetails(EducatorProfile educator) {
        if (educator == null) {
            return null;
        }

        return new ProfileEducatorDetailsResponse(educator.getBio(), educator.getExperience());
    }

    public void mapUserProfile(UpdateUserProfileRequest source, UserProfile target) {
        if (source == null || target == null) {
            return;
        }

        target.setFirstName(source.firstName());
        target.setLastName(source.lastName());
        target.setImageUrl(source.imageUrl());
        target.setBio(source.bio());
        target.setBirthDate(source.birthDate());
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