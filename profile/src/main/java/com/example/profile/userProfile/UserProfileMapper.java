package com.example.profile.userProfile;

import org.springframework.stereotype.Component;

import com.example.profile.rabbitmq.UserCreationEvent;

@Component
public class UserProfileMapper {
    public UserProfile toUserProfile(UpdateUserProfileRequest request) {
        if (request == null) {
            return null;
        }

        return UserProfile.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .birthDate(request.birthDate())
                .build();
    }

    public UserProfile toUserProfile(UserCreationEvent request) {
        if (request == null) {
            return null;
        }

        return UserProfile.builder()
                .identityId(request.getUserId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .birthDate(request.getBirthDate())
                .build();
    }

    public UserProfileResponse fromUserProfile(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getBirthDate());
    }
}