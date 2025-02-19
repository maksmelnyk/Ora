package com.example.profile.features.teacherProfile;

import jakarta.validation.constraints.NotBlank;

public record UpdateTeacherProfileRequest(@NotBlank String bio, @NotBlank String experience) {
}