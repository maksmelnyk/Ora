package com.example.profile.features.userProfile;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.profile.features.userProfile.entities.UserProfile;

import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
}