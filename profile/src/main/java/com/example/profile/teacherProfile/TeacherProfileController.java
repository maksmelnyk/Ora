package com.example.profile.teacherProfile;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/teacher-profiles")
@RequiredArgsConstructor
public class TeacherProfileController {
    private final TeacherProfileService service;

    @GetMapping("/{id}")
    public ResponseEntity<TeacherProfileResponse> getTeacherProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(this.service.getTeacherProfileById(id));
    }

    @PostMapping("/{userProfileId}")
    public ResponseEntity<Void> createUserProfile(
            @PathVariable Long userProfileId,
            @RequestBody @Valid UpdateTeacherProfileRequest request) {
        this.service.createTeacherProfile(userProfileId, request);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUserProfile(
            @PathVariable Long id,
            @RequestBody @Valid UpdateTeacherProfileRequest request) {
        this.service.updateTeacherProfile(id, request);
        return ResponseEntity.accepted().build();
    }
}