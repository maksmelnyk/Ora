package com.example.profile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.ResourceNotFoundException;
import com.example.profile.rabbitmq.TeacherCreatedEventPublisher;
import com.example.profile.teacherProfile.TeacherProfile;
import com.example.profile.teacherProfile.TeacherProfileMapper;
import com.example.profile.teacherProfile.TeacherProfileRepository;
import com.example.profile.teacherProfile.TeacherProfileResponse;
import com.example.profile.teacherProfile.TeacherProfileService;
import com.example.profile.teacherProfile.UpdateTeacherProfileRequest;
import com.example.profile.userProfile.UserProfile;
import com.example.profile.userProfile.UserProfileRepository;

import java.util.Optional;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class TeacherProfileServiceTest {

    @Mock
    TeacherCreatedEventPublisher publisher;
    @Mock
    private TeacherProfileRepository teacherRepository;
    @Mock
    private UserProfileRepository userRepository;
    @Mock
    private CurrentUser currentUser;
    private TeacherProfileMapper mapper;
    private TeacherProfileService service;

    @BeforeEach
    void setUp() {
        mapper = new TeacherProfileMapper();
        service = new TeacherProfileService(currentUser, teacherRepository, userRepository, mapper, publisher);
    }

    @Test
    void getTeacherProfileById_ShouldReturnProfile_WhenProfileExists() {
        Long teacherId = 1L;

        TeacherProfile profile = TeacherProfile.builder()
                .id(teacherId)
                .bio("test-bio")
                .experience("test-experience")
                .build();

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(profile));

        TeacherProfileResponse result = service.getTeacherProfileById(teacherId);

        assertEquals(profile.getId(), result.id());
        assertEquals(profile.getBio(), result.bio());
        assertEquals(profile.getExperience(), result.experience());

        verify(teacherRepository, times(1)).findById(teacherId);
    }

    @Test
    void getTeacherProfileById_ShouldThrowException_WhenProfileDoesNotExist() {
        Long teacherId = 1L;

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> service.getTeacherProfileById(teacherId));

        assertEquals(ErrorCodes.TEACHER_PROFILE_NOT_FOUND, exception.getErrorCode());

        verify(teacherRepository, times(1)).findById(teacherId);
    }

    @Test
    void createTeacherProfile_ShouldSaveProfile_WhenUserProfileExists() {
        UUID userId = UUID.randomUUID();

        UserProfile profile = UserProfile.builder().userId(userId).build();

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        TeacherProfile teacherProfile = TeacherProfile.builder()
                .bio(request.bio())
                .experience(request.experience())
                .userProfile(profile)
                .build();

        when(currentUser.getUserId()).thenReturn(userId);
        when(teacherRepository.existsByUserId(userId)).thenReturn(false);
        when(teacherRepository.save(any(TeacherProfile.class))).thenReturn(teacherProfile);
        when(userRepository.findByUserId(userId)).thenReturn(Optional.of(profile));

        service.createMyTeacherProfile(request);

        verify(userRepository, times(1)).findByUserId(userId);
        verify(teacherRepository, times(1)).save(any(TeacherProfile.class));
    }

    @Test
    void createTeacherProfile_ShouldThrowException_WhenUserProfileDoesNotExist() {
        UUID userId = UUID.randomUUID();

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        when(currentUser.getUserId()).thenReturn(userId);
        when(userRepository.findByUserId(userId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> service.createMyTeacherProfile(request));

        assertEquals(ErrorCodes.USER_PROFILE_NOT_FOUND, exception.getErrorCode());

        verify(userRepository, times(1)).findByUserId(userId);
        verify(teacherRepository, never()).save(any(TeacherProfile.class));
    }

    @Test
    void updateTeacherProfile_ShouldUpdateProfile_WhenProfileExists() {
        UUID userId = UUID.randomUUID();

        TeacherProfile profile = TeacherProfile.builder()
                .bio("old-test-bio")
                .experience("old-test-experience")
                .build();

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        when(currentUser.getUserId()).thenReturn(userId);
        when(teacherRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
        when(teacherRepository.save(profile)).thenReturn(profile);

        service.updateMyTeacherProfile(request);

        assertEquals(request.bio(), profile.getBio());
        assertEquals(request.experience(), profile.getExperience());

        verify(teacherRepository, times(1)).findByUserId(userId);
        verify(teacherRepository, times(1)).save(profile);
    }

    @Test
    void updateTeacherProfile_ShouldThrowException_WhenProfileDoesNotExist() {
        UUID userId = UUID.randomUUID();

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        when(currentUser.getUserId()).thenReturn(userId);
        when(teacherRepository.findByUserId(userId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> service.updateMyTeacherProfile(request));

        assertEquals(ErrorCodes.TEACHER_PROFILE_NOT_FOUND, exception.getErrorCode());

        verify(teacherRepository, times(1)).findByUserId(userId);
        verify(teacherRepository, never()).save(any(TeacherProfile.class));
    }
}
