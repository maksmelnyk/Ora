package com.example.profile.userProfile;

import org.springframework.stereotype.Component;

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

    public UserProfileResponse fromUserProfile(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getBirthDate());
    }
}
