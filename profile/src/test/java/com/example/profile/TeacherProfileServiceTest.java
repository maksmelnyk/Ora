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
import com.example.profile.teacherProfile.TeacherProfile;
import com.example.profile.teacherProfile.TeacherProfileMapper;
import com.example.profile.teacherProfile.TeacherProfileRepository;
import com.example.profile.teacherProfile.TeacherProfileResponse;
import com.example.profile.teacherProfile.TeacherProfileService;
import com.example.profile.teacherProfile.UpdateTeacherProfileRequest;
import com.example.profile.userProfile.UserProfile;
import com.example.profile.userProfile.UserProfileRepository;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class TeacherProfileServiceTest {

    @Mock
    private TeacherProfileRepository teacherRepository;

    @Mock
    private UserProfileRepository userRepository;

    private TeacherProfileMapper mapper;
    private TeacherProfileService service;

    @BeforeEach
    void setUp() {
        mapper = new TeacherProfileMapper();
        service = new TeacherProfileService(teacherRepository, userRepository, mapper);
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
        Long userId = 1L;

        UserProfile profile = UserProfile.builder().id(userId).build();

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        TeacherProfile teacherProfile = TeacherProfile.builder()
                .bio(request.bio())
                .experience(request.experience())
                .userProfile(profile)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(profile));
        when(teacherRepository.save(any(TeacherProfile.class))).thenReturn(teacherProfile);

        service.createTeacherProfile(userId, request);

        verify(userRepository, times(1)).findById(userId);
        verify(teacherRepository, times(1)).save(any(TeacherProfile.class));
    }

    @Test
    void createTeacherProfile_ShouldThrowException_WhenUserProfileDoesNotExist() {
        Long userId = 1L;

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> service.createTeacherProfile(userId, request));

        assertEquals(ErrorCodes.USER_PROFILE_NOT_FOUND, exception.getErrorCode());

        verify(userRepository, times(1)).findById(userId);
        verifyNoInteractions(teacherRepository);
    }

    @Test
    void updateTeacherProfile_ShouldUpdateProfile_WhenProfileExists() {
        Long teacherId = 1L;

        TeacherProfile profile = TeacherProfile.builder()
                .id(teacherId)
                .bio("old-test-bio")
                .experience("old-test-experience")
                .build();

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(profile));
        when(teacherRepository.save(profile)).thenReturn(profile);

        service.updateTeacherProfile(teacherId, request);

        assertEquals(request.bio(), profile.getBio());
        assertEquals(request.experience(), profile.getExperience());

        verify(teacherRepository, times(1)).findById(teacherId);
        verify(teacherRepository, times(1)).save(profile);
    }

    @Test
    void updateTeacherProfile_ShouldThrowException_WhenProfileDoesNotExist() {
        Long teacherId = 1L;

        UpdateTeacherProfileRequest request = new UpdateTeacherProfileRequest("test-bio", "test-experience");

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> service.updateTeacherProfile(teacherId, request));

        assertEquals(ErrorCodes.TEACHER_PROFILE_NOT_FOUND, exception.getErrorCode());

        verify(teacherRepository, times(1)).findById(teacherId);
        verify(teacherRepository, never()).save(any(TeacherProfile.class));
    }
}
