package com.example.auth.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreatedEvent implements Serializable {
    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    private UUID userId;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;

    @Builder.Default
    private UserCreationStatus status = UserCreationStatus.PENDING;

    private String errorMessage;

    public enum UserCreationStatus {
        PENDING, CREATED, VALIDATION_FAILED, PROCESSING_ERROR
    }
}