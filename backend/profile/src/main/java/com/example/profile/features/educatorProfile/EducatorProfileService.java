package com.example.profile.features.educatorProfile;

import java.util.Random;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.profile.exceptions.ConflictException;
import com.example.profile.exceptions.ErrorCodes;
import com.example.profile.exceptions.NotFoundException;
import com.example.profile.features.educatorProfile.contracts.EducatorDetailsResponse;
import com.example.profile.features.educatorProfile.contracts.EducatorSummaryResponse;
import com.example.profile.features.educatorProfile.contracts.PagedResult;
import com.example.profile.features.educatorProfile.contracts.UpdateEducatorProfileRequest;
import com.example.profile.features.educatorProfile.entities.EducatorProfile;
import com.example.profile.features.educatorProfile.entities.EducatorVerificationStatus;
import com.example.profile.features.userProfile.UserProfileRepository;
import com.example.profile.features.userProfile.entities.UserProfile;
import com.example.profile.infrastructure.identity.CurrentUser;
import com.example.profile.infrastructure.messaging.events.EducatorCreatedEvent;
import com.example.profile.infrastructure.messaging.events.EducatorProfileUpdatedEvent;
import com.example.profile.infrastructure.messaging.publishers.EventPublisher;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EducatorProfileService {
    private final CurrentUser currentUser;
    private final EventPublisher publisher;
    private final EducatorProfileMapper mapper;
    private final EducatorProfileRepository repository;
    private final UserProfileRepository profileRepository;

    private static final Random random = new Random();

    public PagedResult<EducatorSummaryResponse> getEducatorProfiles(int pageNumber, int pageSize) {
        PageRequest pageable = PageRequest.of(pageNumber - 1, pageSize,
                Sort.by(Sort.Order.desc("hasProduct"), Sort.Order.desc("createdDate")));

        Page<EducatorProfile> educatorProfiles = this.repository.findByStatus(
                EducatorVerificationStatus.APPROVED, pageable);

        // TODO: replace random with real data
        return new PagedResult<EducatorSummaryResponse>(
                educatorProfiles.getContent().stream().map(m -> mapper.toEducatorSummary(m, random)).toList(),
                educatorProfiles.getTotalPages(),
                educatorProfiles.getTotalElements(),
                pageNumber,
                educatorProfiles.getSize());
    }

    public PagedResult<EducatorSummaryResponse> getRecommendedEducatorProfiles(int pageNumber, int pageSize) {
        // TODO: update sorting
        PageRequest pageable = PageRequest.of(pageNumber - 1, pageSize,
                Sort.by(Sort.Order.desc("hasProduct"), Sort.Order.desc("createdDate")));

        Page<EducatorProfile> educatorProfiles = this.repository.findByStatus(
                EducatorVerificationStatus.APPROVED, pageable);

        // TODO: replace random with real data
        return new PagedResult<EducatorSummaryResponse>(
                educatorProfiles.getContent().stream().map(m -> mapper.toEducatorSummary(m, random)).toList(),
                educatorProfiles.getTotalPages(),
                educatorProfiles.getTotalElements(),
                pageNumber,
                educatorProfiles.getSize());
    }

    // TODO: replace random with real data
    public EducatorDetailsResponse getEducatorProfileById(UUID id) {
        return this.repository.findApprovedById(id)
                .map(m -> mapper.toEducatorDetails(m, random))
                .orElseThrow(() -> new NotFoundException("Profile not found", ErrorCodes.EDUCATOR_PROFILE_NOT_FOUND));
    }

    @Transactional
    public void createMyEducatorProfile(UpdateEducatorProfileRequest request) {
        UUID userId = this.currentUser.getUserId();
        if (this.repository.existsById(userId)) {
            throw new ConflictException("Educator profile already exists", ErrorCodes.EDUCATOR_PROFILE_EXISTS);
        }

        UserProfile profile = this.profileRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found", ErrorCodes.USER_PROFILE_NOT_FOUND));

        EducatorProfile educatorProfile = mapper.toEducatorProfile(request);
        educatorProfile.setUserProfile(profile);
        educatorProfile.setStatus(EducatorVerificationStatus.APPROVED);

        this.repository.save(educatorProfile);

        this.publisher.publishEducatorCreated(new EducatorCreatedEvent(userId.toString()));

        EducatorProfileUpdatedEvent updatedEvent = new EducatorProfileUpdatedEvent(userId.toString(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getImageUrl());
        this.publisher.publishEducatorProfileUpdatedEvent(updatedEvent);
    }

    public void updateMyEducatorProfile(UpdateEducatorProfileRequest request) {
        UUID userId = this.currentUser.getUserId();
        EducatorProfile profile = this.repository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found", ErrorCodes.EDUCATOR_PROFILE_NOT_FOUND));

        profile.setBio(request.bio());
        profile.setExperience(request.experience());
        profile.setVideoUrl(request.videoUrl());

        this.repository.save(profile);
    }

    public void setEducatorHasProduct(String userId) {
        EducatorProfile profile = this.repository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new NotFoundException("Profile not found", ErrorCodes.EDUCATOR_PROFILE_NOT_FOUND));

        if (profile.isHasProduct()) {
            return;
        }

        profile.setHasProduct(true);
        this.repository.save(profile);
    }
}