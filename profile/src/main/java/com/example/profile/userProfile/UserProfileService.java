package com.example.profile.userProfile;

import org.springframework.stereotype.Service;

import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository repository;
    private final UserProfileMapper mapper;

    public UserProfileResponse getUserProfileById(Long id) {
        return this.repository.findById(id)
                .map(mapper::fromUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));
    }

    public void createUserProfile(UpdateUserProfileRequest request) {
        this.repository.save(mapper.toUserProfile(request));
    }

    public void updateUserProfile(Long id, UpdateUserProfileRequest request) {
        var profile = this.repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));

        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setBirthDate(request.birthDate());

        this.repository.save(profile);
    }
}