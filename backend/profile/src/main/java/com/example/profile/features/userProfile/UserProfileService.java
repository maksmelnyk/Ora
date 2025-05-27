package com.example.profile.features.userProfile;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.profile.exceptions.ErrorCodes;
import com.example.profile.exceptions.NotFoundException;
import com.example.profile.features.educatorProfile.EducatorProfileRepository;
import com.example.profile.features.educatorProfile.entities.EducatorProfile;
import com.example.profile.features.userProfile.contracts.ProfileDetailsResponse;
import com.example.profile.features.userProfile.contracts.UpdateUserProfileRequest;
import com.example.profile.features.userProfile.entities.UserProfile;
import com.example.profile.infrastructure.identity.CurrentUser;
import com.example.profile.infrastructure.messaging.events.RegistrationCompletedEvent;
import com.example.profile.infrastructure.messaging.events.RegistrationInitiatedEvent;
import com.example.profile.infrastructure.messaging.publishers.EventPublisher;

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
        UserProfile user = this.repository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found", ErrorCodes.USER_PROFILE_NOT_FOUND));
        EducatorProfile educator = this.educatorRepository.findById(userId).orElse(null);
        return this.mapper.toProfileDetails(user, educator);
    }

    public ProfileDetailsResponse getUserProfileById(UUID id) {
        UserProfile user = this.repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Profile not found", ErrorCodes.USER_PROFILE_NOT_FOUND));
        EducatorProfile educator = this.educatorRepository.findById(id).orElse(null);
        return this.mapper.toProfileDetails(user, educator);
    }

    public void updateUserProfile(UpdateUserProfileRequest request) {
        UUID userId = this.currentUser.getUserId();
        var profile = this.repository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found", ErrorCodes.USER_PROFILE_NOT_FOUND));

        this.mapper.mapUserProfile(request, profile);
        this.repository.save(profile);

        if (educatorRepository.existsById(userId)) {
            this.eventPublisher.publishEducatorProfileUpdatedEvent(mapper.toProfileUpdatedEvent(profile));
        }
    }

    public void createUserProfile(RegistrationInitiatedEvent request) {
        String userId = request.getUserId();
        boolean success = false;
        String errorMessage = null;

        try {
            this.repository.save(this.mapper.toUserProfile(request));
            success = true;
        } catch (Exception e) {
            log.error("Error creating user profile for userId: {}", userId, e);
            errorMessage = e.getMessage();
        }

        RegistrationCompletedEvent event = new RegistrationCompletedEvent(
                userId,
                success,
                errorMessage);
        event.setCorrelationId(request.getCorrelationId());
        this.eventPublisher.publishRegistrationCompleted(event);
    }
}