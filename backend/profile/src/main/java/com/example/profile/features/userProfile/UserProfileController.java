package com.example.profile.features.userProfile;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.profile.features.userProfile.contracts.ProfileDetailsResponse;
import com.example.profile.features.userProfile.contracts.UpdateUserProfileRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/profiles")
@Tag(name = "Profiles", description = "User profile APIs")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService service;

    @Operation(summary = "Retrieve User Profile by ID", description = "Get user profile details by providing the user's unique identifier.")
    @GetMapping("/{id}")
    public ResponseEntity<ProfileDetailsResponse> getUserProfileById(@PathVariable UUID id) {
        return ResponseEntity.ok(this.service.getUserProfileById(id));
    }

    @Operation(summary = "Retrieve Current User Profile", description = "Fetch the profile details of the currently authenticated user.")
    @GetMapping("/me")
    public ResponseEntity<ProfileDetailsResponse> getMyUserProfile() {
        return ResponseEntity.ok(this.service.getMyUserProfile());
    }

    @Operation(summary = "Update Current User Profile", description = "Update the profile information of the currently authenticated user.")
    @PutMapping("/me")
    public ResponseEntity<Void> updateUserProfile(@RequestBody @Valid UpdateUserProfileRequest request) {
        this.service.updateUserProfile(request);
        return ResponseEntity.noContent().build();
    }
}