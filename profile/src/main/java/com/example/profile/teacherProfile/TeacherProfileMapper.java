package com.example.profile.teacherProfile;

import org.springframework.stereotype.Component;

@Component
public class TeacherProfileMapper {
    public TeacherProfile toUserProfile(UpdateTeacherProfileRequest request) {
        if (request == null) {
            return null;
        }

        return TeacherProfile.builder()
                .bio(request.bio())
                .experience(request.experience())
                .build();
    }

    public TeacherProfileResponse fromUserProfile(TeacherProfile profile) {
        return new TeacherProfileResponse(
                profile.getId(),
                profile.getBio(),
                profile.getExperience());
    }
}
