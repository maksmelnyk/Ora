package com.example.profile.teacherProfile;

import com.example.profile.CurrentUser;
import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.InvalidRequestException;
import com.example.profile.exception.ResourceNotFoundException;
import com.example.profile.rabbitmq.TeacherCreatedEventPublisher;
import com.example.profile.userProfile.UserProfile;
import com.example.profile.userProfile.UserProfileRepository;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherProfileService {
    private final CurrentUser currentUser;
    private final TeacherProfileRepository repository;
    private final UserProfileRepository userProfileRepository;
    private final TeacherProfileMapper mapper;
    private final TeacherCreatedEventPublisher publisher;

    public TeacherProfileResponse[] getTeacherProfiles(int skip, int take) {
        PageRequest pageable = PageRequest.of(skip / take, take);
        Page<TeacherProfile> page = this.repository.findAll(pageable);

        return page.stream().map(mapper::fromUserProfile).toArray(TeacherProfileResponse[]::new);
    }

    public TeacherProfileResponse getTeacherProfileById(Long id) {
        return this.repository.findById(id)
                .map(mapper::fromUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.TEACHER_PROFILE_NOT_FOUND));
    }

    public void createMyTeacherProfile(UpdateTeacherProfileRequest request) {
        UUID userId = this.currentUser.getUserId();
        if (this.repository.existsByUserId(userId)) {
            throw new InvalidRequestException("Teacher profile already exists", ErrorCodes.TEACHER_PROFILE_EXISTS);
        }

        UserProfile profile = this.userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + userId + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));

        var teacherProfile = this.mapper.toUserProfile(request);
        teacherProfile.setUserProfile(profile);

        this.repository.save(teacherProfile);
        this.publisher.sendTeacherCreatedEvent(userId);
    }

    public void updateMyTeacherProfile(UpdateTeacherProfileRequest request) {
        UUID userId = this.currentUser.getUserId();
        TeacherProfile profile = this.repository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + userId + "not found",
                        ErrorCodes.TEACHER_PROFILE_NOT_FOUND));

        profile.setBio(request.bio());
        profile.setExperience(request.experience());

        this.repository.save(profile);
    }
}