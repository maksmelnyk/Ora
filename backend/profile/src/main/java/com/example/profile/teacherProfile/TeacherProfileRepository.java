package com.example.profile.teacherProfile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {
    @Query("SELECT tp FROM TeacherProfile tp WHERE tp.userProfile.userId = :userId")
    Optional<TeacherProfile> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT CASE WHEN COUNT(tp) > 0 THEN TRUE ELSE FALSE END FROM TeacherProfile tp WHERE tp.userProfile.userId = :userId")
    boolean existsByUserId(@Param("userId") UUID userId);
}