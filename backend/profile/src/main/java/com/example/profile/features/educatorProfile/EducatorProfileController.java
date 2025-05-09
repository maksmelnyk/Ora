package com.example.profile.features.educatorProfile;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.profile.features.educatorProfile.contracts.EducatorDetailsResponse;
import com.example.profile.features.educatorProfile.contracts.EducatorSummaryResponse;
import com.example.profile.features.educatorProfile.contracts.PagedResult;
import com.example.profile.features.educatorProfile.contracts.UpdateEducatorProfileRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/educators")
@Tag(name = "Educators", description = "APIs for managing educator profiles")
@RequiredArgsConstructor
public class EducatorProfileController {
    private final EducatorProfileService service;

    @Operation(summary = "Retrieve Educator Profiles", description = "Retrieve a paginated list of educator profiles using the 'skip' and 'take' query parameters.")
    @GetMapping()
    public ResponseEntity<PagedResult<EducatorSummaryResponse>> getEducatorProfiles(
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "20") int pageSize) {
        return ResponseEntity.ok(this.service.getEducatorProfiles(pageNumber, pageSize));
    }

    @Operation(summary = "Retrieve Educator Profile by ID", description = "Retrieve detailed information about an educator given their unique identifier.")
    @GetMapping("/{id}")
    public ResponseEntity<EducatorDetailsResponse> getEducatorProfileById(@PathVariable UUID id) {
        return ResponseEntity.ok(this.service.getEducatorProfileById(id));
    }

    @Operation(summary = "Create Educator Profile", description = "Create an educator profile for the current authenticated user using the supplied details.")
    @PostMapping("/me")
    public ResponseEntity<Void> createMyEducatorProfile(@RequestBody @Valid UpdateEducatorProfileRequest request) {
        this.service.createMyEducatorProfile(request);
        return ResponseEntity.accepted().build();
    }

    @Operation(summary = "Update Educator Profile", description = "Update the educator profile of the currently authenticated user with the provided information.")
    @PutMapping("/me")
    public ResponseEntity<Void> updateMyEducatorProfile(@RequestBody @Valid UpdateEducatorProfileRequest request) {
        this.service.updateMyEducatorProfile(request);
        return ResponseEntity.accepted().build();
    }
}