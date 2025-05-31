package com.example.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.profile.exceptions.ErrorCodes;
import com.example.profile.exceptions.NotFoundException;
import com.example.profile.features.educatorProfile.EducatorProfileMapper;
import com.example.profile.features.educatorProfile.EducatorProfileRepository;
import com.example.profile.features.educatorProfile.EducatorProfileService;
import com.example.profile.features.educatorProfile.contracts.EducatorDetailsResponse;
import com.example.profile.features.educatorProfile.contracts.UpdateEducatorProfileRequest;
import com.example.profile.features.educatorProfile.entities.EducatorProfile;
import com.example.profile.features.userProfile.UserProfileRepository;
import com.example.profile.features.userProfile.entities.UserProfile;
import com.example.profile.infrastructure.identity.CurrentUser;
import com.example.profile.infrastructure.messaging.publishers.EventPublisher;

@ExtendWith(MockitoExtension.class)
class EducatorProfileServiceTest {

    @Mock
    EventPublisher publisher;
    @Mock
    private EducatorProfileRepository educatorRepository;
    @Mock
    private UserProfileRepository profileRepository;
    @Mock
    private CurrentUser currentUser;
    private EducatorProfileMapper mapper;
    private EducatorProfileService service;

    @BeforeEach
    void setUp() {
        mapper = new EducatorProfileMapper();
        service = new EducatorProfileService(currentUser, publisher, mapper, educatorRepository, profileRepository);
    }

    @Test
    void getEducatorProfileById_ShouldReturnProfile_WhenProfileExists() {
        UUID educatorId = UUID.randomUUID();

        EducatorProfile profile = EducatorProfile.builder()
                .id(educatorId)
                .bio("test-bio")
                .experience("test-experience")
                .build();

        when(educatorRepository.findById(educatorId)).thenReturn(Optional.of(profile));

        EducatorDetailsResponse result = service.getEducatorProfileById(educatorId);

        assertEquals(profile.getId(), result.id());
        assertEquals(profile.getBio(), result.bio());
        assertEquals(profile.getExperience(), result.experience());

        verify(educatorRepository, times(1)).findById(educatorId);
    }

    @Test
    void getEducatorProfileById_ShouldThrowException_WhenProfileDoesNotExist() {
        UUID educatorId = UUID.randomUUID();

        when(educatorRepository.findById(educatorId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> service.getEducatorProfileById(educatorId));

        assertEquals(ErrorCodes.EDUCATOR_PROFILE_NOT_FOUND, exception.getCode());

        verify(educatorRepository, times(1)).findById(educatorId);
    }

    @Test
    void createEducatorProfile_ShouldSaveProfile_WhenUserProfileExists() {
        UUID userId = UUID.randomUUID();

        UserProfile profile = UserProfile.builder().id(userId).build();

        UpdateEducatorProfileRequest request = new UpdateEducatorProfileRequest(
                "test-bio",
                "test-experience",
                "test-video-url");

        EducatorProfile educatorProfile = EducatorProfile.builder()
                .bio(request.bio())
                .experience(request.experience())
                .userProfile(profile)
                .build();

        when(currentUser.getUserId()).thenReturn(userId);
        when(educatorRepository.existsById(userId)).thenReturn(false);
        when(educatorRepository.save(any(EducatorProfile.class))).thenReturn(educatorProfile);
        when(profileRepository.findById(userId)).thenReturn(Optional.of(profile));

        service.createMyEducatorProfile(request);

        verify(profileRepository, times(1)).findById(userId);
        verify(educatorRepository, times(1)).save(any(EducatorProfile.class));
    }

    @Test
    void createEducatorProfile_ShouldThrowException_WhenUserProfileDoesNotExist() {
        UUID userId = UUID.randomUUID();

        UpdateEducatorProfileRequest request = new UpdateEducatorProfileRequest(
                "test-bio",
                "test-experience",
                "test-video-url");

        when(currentUser.getUserId()).thenReturn(userId);
        when(profileRepository.findById(userId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> service.createMyEducatorProfile(request));

        assertEquals(ErrorCodes.USER_PROFILE_NOT_FOUND, exception.getCode());

        verify(profileRepository, times(1)).findById(userId);
        verify(educatorRepository, never()).save(any(EducatorProfile.class));
    }

    @Test
    void updateEducatorProfile_ShouldUpdateProfile_WhenProfileExists() {
        UUID userId = UUID.randomUUID();

        EducatorProfile profile = EducatorProfile.builder()
                .bio("old-test-bio")
                .experience("old-test-experience")
                .build();

        UpdateEducatorProfileRequest request = new UpdateEducatorProfileRequest(
                "test-bio",
                "test-experience",
                "test-video-url");

        when(currentUser.getUserId()).thenReturn(userId);
        when(educatorRepository.findById(userId)).thenReturn(Optional.of(profile));
        when(educatorRepository.save(profile)).thenReturn(profile);

        service.updateMyEducatorProfile(request);

        assertEquals(request.bio(), profile.getBio());
        assertEquals(request.experience(), profile.getExperience());

        verify(educatorRepository, times(1)).findById(userId);
        verify(educatorRepository, times(1)).save(profile);
    }

    @Test
    void updateEducatorProfile_ShouldThrowException_WhenProfileDoesNotExist() {
        UUID userId = UUID.randomUUID();

        UpdateEducatorProfileRequest request = new UpdateEducatorProfileRequest(
                "test-bio",
                "test-experience",
                "test-video-url");

        when(currentUser.getUserId()).thenReturn(userId);
        when(educatorRepository.findById(userId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> service.updateMyEducatorProfile(request));

        assertEquals(ErrorCodes.EDUCATOR_PROFILE_NOT_FOUND, exception.getCode());

        verify(educatorRepository, times(1)).findById(userId);
        verify(educatorRepository, never()).save(any(EducatorProfile.class));
    }
}
