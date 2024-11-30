package com.example.profile.teacherProfile;

import org.springframework.stereotype.Service;

import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.ResourceNotFoundException;
import com.example.profile.userProfile.UserProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherProfileService {
    private final TeacherProfileRepository repository;
    private final UserProfileRepository userProfileRepository;
    private final TeacherProfileMapper mapper;

    public TeacherProfileResponse getTeacherProfileById(Long id) {
        return this.repository.findById(id)
                .map(mapper::fromUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.TEACHER_PROFILE_NOT_FOUND));
    }

    public void createTeacherProfile(Long userProfileId, UpdateTeacherProfileRequest request) {
        var profile = this.userProfileRepository.findById(userProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + userProfileId + "not found",
                        ErrorCodes.USER_PROFILE_NOT_FOUND));

        var teacherProfile = mapper.toUserProfile(request);
        teacherProfile.setUserProfile(profile);

        this.repository.save(teacherProfile);
    }

    public void updateTeacherProfile(Long id, UpdateTeacherProfileRequest request) {
        var profile = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile with id " + id + "not found",
                        ErrorCodes.TEACHER_PROFILE_NOT_FOUND));

        profile.setBio(request.bio());
        profile.setExperience(request.experience());

        this.repository.save(profile);
    }
}
