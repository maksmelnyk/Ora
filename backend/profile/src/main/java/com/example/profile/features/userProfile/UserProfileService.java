package com.example.profile.features.userProfile;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.profile.exceptions.ErrorCodes;
import com.example.profile.exceptions.ResourceNotFoundException;
import com.example.profile.features.userProfile.contracts.UpdateUserProfileRequest;
import com.example.profile.infrastructure.identity.CurrentUser;
import com.example.profile.infrastructure.messaging.events.RegistrationCompletedEvent;
import com.example.profile.infrastructure.messaging.events.RegistrationInitiatedEvent;
import com.example.profile.infrastructure.messaging.publishers.EventPublisher;
import com.example.profile.features.educatorProfile.EducatorProfileRepository;
import com.example.profile.features.userProfile.contracts.ProfileDetailsResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final CurrentUser currentUser;
    private final EventPublisher eventPublisher;
    private final UserProfileMapper mapper;
    private final UserProfileRepository repository;
    private final EducatorProfileRepository educatorRepository;

    public ProfileDetailsResponse getMyUserProfile() {
        UUID userId = this.currentUser.getUserId();
        return this.repository.findById(userId)
                .map(mapper::toProfileDetails)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + userId + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));
    }

    public ProfileDetailsResponse getUserProfileById(UUID id) {
        return this.repository.findById(id)
                .map(mapper::toProfileDetails)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));
    }

    public void updateUserProfile(UpdateUserProfileRequest request) {
        UUID userId = this.currentUser.getUserId();
        var profile = this.repository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + userId + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));

        this.mapper.mapUserProfile(request, profile);
        this.repository.save(profile);

        if (educatorRepository.existsById(userId)) {
            this.eventPublisher.publishEducatorProfileUpdatedEvent(mapper.toProfileUpdatedEvent(profile));
        }
    }

    public void createUserProfile(RegistrationInitiatedEvent request) {
        var profile = this.mapper.toUserProfile(request);
        this.repository.save(profile);
        RegistrationCompletedEvent event = new RegistrationCompletedEvent(
                request.getUserId(),
                true,
                null);
        event.setCorrelationId(request.getCorrelationId());
        this.eventPublisher.publishRegistrationCompleted(event);
    }
}