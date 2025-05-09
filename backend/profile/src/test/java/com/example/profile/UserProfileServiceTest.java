package com.example.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.profile.exceptions.ErrorCodes;
import com.example.profile.exceptions.ResourceNotFoundException;
import com.example.profile.features.educatorProfile.EducatorProfileRepository;
import com.example.profile.features.userProfile.UserProfileMapper;
import com.example.profile.features.userProfile.UserProfileRepository;
import com.example.profile.features.userProfile.UserProfileService;
import com.example.profile.features.userProfile.contracts.UpdateUserProfileRequest;
import com.example.profile.features.userProfile.contracts.ProfileDetailsResponse;
import com.example.profile.features.userProfile.entities.UserProfile;
import com.example.profile.infrastructure.rabbitmq.publishers.EventPublisher;
import com.example.profile.middlewares.security.CurrentUser;

@ExtendWith(MockitoExtension.class)
public class UserProfileServiceTest {
    @Mock
    EventPublisher publisher;
    @Mock
    private CurrentUser currentUser;
    @Mock
    private UserProfileRepository profileRepository;
    @Mock
    private EducatorProfileRepository educatorRepository;

    private UserProfileMapper mapper;
    private UserProfileService service;

    @BeforeEach
    void setUp() {
        mapper = new UserProfileMapper();
        service = new UserProfileService(currentUser, publisher, mapper, profileRepository, educatorRepository);
    }

    @Test
    void getUserProfileById_ShouldReturnProfile_WhenProfileExists() {
        UUID userId = UUID.randomUUID();

        UserProfile profile = UserProfile.builder()
                .id(userId)
                .firstName("first-name")
                .lastName("last-name")
                .birthDate(LocalDate.of(2000, 1, 1))
                .build();

        when(profileRepository.findById(userId)).thenReturn(Optional.of(profile));

        ProfileDetailsResponse result = service.getUserProfileById(userId);

        assertEquals(profile.getId(), result.id());
        assertEquals(profile.getFirstName(), result.firstName());
        assertEquals(profile.getLastName(), result.lastName());
        assertEquals(profile.getBirthDate(), result.birthDate());

        verify(profileRepository, times(1)).findById(userId);
    }

    @Test
    void getUserProfileById_ShouldThrowException_WhenProfileDoesNotExist() {
        UUID userId = UUID.randomUUID();

        when(profileRepository.findById(userId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.getUserProfileById(userId));

        assertEquals(ErrorCodes.USER_PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(profileRepository, times(1)).findById(userId);
    }

    @Test
    void updateUserProfile_ShouldUpdateProfile_WhenProfileExists() {
        UUID userId = UUID.randomUUID();

        UserProfile profile = UserProfile.builder()
                .id(userId)
                .firstName("old-first-name")
                .lastName("old-last-name")
                .birthDate(LocalDate.of(1990, 1, 1))
                .build();

        UpdateUserProfileRequest request = new UpdateUserProfileRequest(
                "new-first-name",
                "new-last-name",
                LocalDate.of(2000, 1, 1),
                "test-bio",
                "test-url");

        when(currentUser.getUserId()).thenReturn(userId);
        when(profileRepository.findById(userId)).thenReturn(Optional.of(profile));

        service.updateUserProfile(request);

        assertEquals(request.firstName(), profile.getFirstName());
        assertEquals(request.lastName(), profile.getLastName());
        assertEquals(request.birthDate(), profile.getBirthDate());
        assertEquals(request.bio(), profile.getBio());

        verify(profileRepository, times(1)).findById(userId);
        verify(profileRepository, times(1)).save(profile);
    }

    @Test
    void updateUserProfile_ShouldThrowException_WhenProfileDoesNotExist() {
        UUID userId = UUID.randomUUID();

        UpdateUserProfileRequest request = new UpdateUserProfileRequest(
                "new-first-name",
                "new-last-name",
                LocalDate.of(2000, 1, 1),
                "test-bio",
                "test-url");

        when(currentUser.getUserId()).thenReturn(userId);
        when(profileRepository.findById(userId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateUserProfile(request));

        assertEquals(ErrorCodes.USER_PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(profileRepository, times(1)).findById(userId);
        verify(profileRepository, never()).save(any());
    }
}
