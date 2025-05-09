package com.example.profile.features.userProfile.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
public class UserProfile {
    @Id
    @Column(nullable = false, unique = true)
    private UUID id;

    @Column(nullable = false, length = 50)
    @Size(max = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    @Size(max = 50)
    private String lastName;

    @Column(length = 200, nullable = true)
    private String imageUrl;

    @Column(length = 2000, nullable = true)
    private String bio;

    @Column(nullable = false)
    private LocalDate birthDate;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;

    private LocalDateTime deletedDate;
}