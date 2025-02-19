package com.example.profile.features.teacherProfile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/teacher-profiles")
@RequiredArgsConstructor
public class TeacherProfileController {
    private final TeacherProfileService service;

    @GetMapping()
    public ResponseEntity<TeacherProfileResponse[]> getTeacherProfiles(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int take) {
        return ResponseEntity.ok(this.service.getTeacherProfiles(skip, take));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherProfileResponse> getTeacherProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(this.service.getTeacherProfileById(id));
    }

    @PostMapping("/me")
    public ResponseEntity<Void> createMyTeacherProfile(@RequestBody @Valid UpdateTeacherProfileRequest request) {
        this.service.createMyTeacherProfile(request);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateMyTeacherProfile(@RequestBody @Valid UpdateTeacherProfileRequest request) {
        this.service.updateMyTeacherProfile(request);
        return ResponseEntity.accepted().build();
    }
}