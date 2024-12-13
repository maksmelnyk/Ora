package com.example.profile.userProfile;

import com.example.profile.CurrentUser;
import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository repository;
    private final UserProfileMapper mapper;
    private final CurrentUser currentUser;

    public UserProfileResponse getMyUserProfile() {
        return this.repository.findByUserId(this.currentUser.getUserId())
                .map(mapper::fromUserProfile)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Profile with id " + this.currentUser.getUserId() + "not found",
                                ErrorCodes.USER_PROFILE_NOT_FOUND));
    }

    public UserProfileResponse getUserProfileById(Long id) {
        return this.repository.findById(id)
                .map(mapper::fromUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));
    }

    public void updateUserProfile(UpdateUserProfileRequest request) {
        var profile = this.repository.findByUserId(this.currentUser.getUserId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Profile with id " + currentUser.getUserId() + "not found",
                                ErrorCodes.USER_PROFILE_NOT_FOUND));

        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setBirthDate(request.birthDate());

        this.repository.save(profile);
    }
}