package com.example.profile.features.educatorProfile;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.profile.features.educatorProfile.entities.EducatorProfile;
import com.example.profile.features.educatorProfile.entities.EducatorVerificationStatus;

public interface EducatorProfileRepository extends JpaRepository<EducatorProfile, UUID> {
    Page<EducatorProfile> findByStatus(EducatorVerificationStatus status, Pageable pageable);

    Optional<EducatorProfile> findApprovedById(UUID id);
}