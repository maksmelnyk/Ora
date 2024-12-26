package com.example.profile.userProfile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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