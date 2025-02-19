package com.example.profile.features.userProfile;

import com.example.profile.exceptions.ErrorCodes;
import com.example.profile.exceptions.ResourceNotFoundException;
import com.example.profile.middlewares.security.CurrentUser;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository repository;
    private final UserProfileMapper mapper;
    private final CurrentUser currentUser;

    public UserProfileResponse getMyUserProfile() {
        UUID userId = this.currentUser.getUserId();
        return this.repository.findByUserId(userId)
                .map(mapper::fromUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + userId + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));
    }

    public UserProfileResponse getUserProfileById(Long id) {
        return this.repository.findById(id)
                .map(mapper::fromUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));
    }

    public void updateUserProfile(UpdateUserProfileRequest request) {
        UUID userId = this.currentUser.getUserId();
        var profile = this.repository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + userId + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));

        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setBirthDate(request.birthDate());

        this.repository.save(profile);
    }
}