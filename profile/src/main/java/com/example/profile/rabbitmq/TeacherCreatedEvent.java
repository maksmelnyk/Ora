package com.example.profile.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherCreatedEvent implements Serializable {
    @Builder.Default
    private final String eventId = UUID.randomUUID().toString();

    private UUID userId;
}