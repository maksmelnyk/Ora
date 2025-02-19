package com.example.profile.features.userProfile;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyUserProfile() {
        return ResponseEntity.ok(this.service.getMyUserProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateUserProfile(@RequestBody @Valid UpdateUserProfileRequest request) {
        this.service.updateUserProfile(request);
        return ResponseEntity.accepted().build();
    }
}