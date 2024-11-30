package com.example.profile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.ResourceNotFoundException;
import com.example.profile.userProfile.UpdateUserProfileRequest;
import com.example.profile.userProfile.UserProfile;
import com.example.profile.userProfile.UserProfileMapper;
import com.example.profile.userProfile.UserProfileRepository;
import com.example.profile.userProfile.UserProfileResponse;
import com.example.profile.userProfile.UserProfileService;

@ExtendWith(MockitoExtension.class)
public class UserProfileServiceTest {

    @Mock
    private UserProfileRepository repository;

    private UserProfileMapper mapper;
    private UserProfileService service;

    @BeforeEach
    void setUp() {
        mapper = new UserProfileMapper();
        service = new UserProfileService(repository, mapper);
    }

    @Test
    void getUserProfileById_ShouldReturnProfile_WhenProfileExists() {
        Long userId = 1L;

        UserProfile profile = UserProfile.builder()
                .id(userId)
                .firstName("first-name")
                .lastName("last-name")
                .birthDate(LocalDate.of(2000, 1, 1))
                .build();

        when(repository.findById(userId)).thenReturn(Optional.of(profile));

        UserProfileResponse result = service.getUserProfileById(userId);

        assertEquals(profile.getId(), result.id());
        assertEquals(profile.getFirstName(), result.firstName());
        assertEquals(profile.getLastName(), result.lastName());
        assertEquals(profile.getBirthDate(), result.birthDate());

        verify(repository, times(1)).findById(userId);
    }

    @Test
    void getUserProfileById_ShouldThrowException_WhenProfileDoesNotExist() {
        Long userId = 1L;

        when(repository.findById(userId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.getUserProfileById(userId));

        assertEquals(ErrorCodes.USER_PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(repository, times(1)).findById(userId);
    }

    @Test
    void createUserProfile_ShouldSaveProfile() {
        UpdateUserProfileRequest request = new UpdateUserProfileRequest("first-name", "last-name",
                LocalDate.of(2000, 1, 1));

        UserProfile userProfile = mapper.toUserProfile(request);

        service.createUserProfile(request);

        verify(repository, times(1)).save(userProfile);
    }

    @Test
    void updateUserProfile_ShouldUpdateProfile_WhenProfileExists() {
        Long userId = 1L;

        UserProfile profile = UserProfile.builder()
                .id(userId)
                .firstName("old-first-name")
                .lastName("old-last-name")
                .birthDate(LocalDate.of(1990, 1, 1))
                .build();

        UpdateUserProfileRequest request = new UpdateUserProfileRequest(
                "new-first-name", "new-last-name", LocalDate.of(2000, 1, 1));

        when(repository.findById(userId)).thenReturn(Optional.of(profile));

        service.updateUserProfile(userId, request);

        assertEquals(request.firstName(), profile.getFirstName());
        assertEquals(request.lastName(), profile.getLastName());
        assertEquals(request.birthDate(), profile.getBirthDate());

        verify(repository, times(1)).findById(userId);
        verify(repository, times(1)).save(profile);
    }

    @Test
    void updateUserProfile_ShouldThrowException_WhenProfileDoesNotExist() {
        Long userId = 1L;
        UpdateUserProfileRequest request = new UpdateUserProfileRequest("first-name", "last-name",
                LocalDate.of(2000, 1, 1));

        when(repository.findById(userId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateUserProfile(userId, request));

        assertEquals(ErrorCodes.USER_PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(repository, times(1)).findById(userId);
        verify(repository, never()).save(any());
    }
}
