package com.example.profile.features.userProfile;

import org.springframework.stereotype.Component;

import com.example.profile.infrastructure.rabbitmq.UserCreatedEvent;

@Component
public class UserProfileMapper {
    public UserProfile toUserProfile(UserCreatedEvent request) {
        if (request == null) {
            return null;
        }

        return UserProfile.builder()
                .userId(request.getUserId())
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