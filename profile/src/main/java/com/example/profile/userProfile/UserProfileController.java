package com.example.profile.userProfile;

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
@RequestMapping("api/v1/user-profiles")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService service;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(this.service.getUserProfileById(id));
    }

    @PostMapping
    public ResponseEntity<Void> createUserProfile(@RequestBody @Valid UpdateUserProfileRequest request) {
        this.service.createUserProfile(request);
        return ResponseEntity.accepted().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUserProfile(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserProfileRequest request) {
        this.service.updateUserProfile(id, request);
        return ResponseEntity.accepted().build();
    }
}