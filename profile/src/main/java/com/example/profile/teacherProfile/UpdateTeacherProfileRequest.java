package com.example.profile.teacherProfile;

import jakarta.validation.constraints.NotBlank;

public record UpdateTeacherProfileRequest(@NotBlank String bio, @NotBlank String experience) {
}