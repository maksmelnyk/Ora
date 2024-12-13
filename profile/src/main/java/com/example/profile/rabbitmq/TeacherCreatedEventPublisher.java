package com.example.profile.rabbitmq;

import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.ResourceNotCreatedException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class TeacherCreatedEventPublisher {
    private final RabbitTemplate template;
    private final RabbitMQProperties properties;
    private final ObjectMapper objectMapper;

    public void sendTeacherCreatedEvent(UUID userId) {
        TeacherCreatedEvent event = TeacherCreatedEvent.builder().userId(userId).build();

        try {
            String eventJson = this.objectMapper.writeValueAsString(event);
            template.convertAndSend(
                    this.properties.getTeacherExchange(),
                    this.properties.getTeacherCreatedRoutingKey(),
                    eventJson
            );
        } catch (Exception e) {
            // TODO: fix exception
            throw new ResourceNotCreatedException("Failed to create user", ErrorCodes.TEACHER_PROFILE_NOT_FOUND, e);
        }
    }
}