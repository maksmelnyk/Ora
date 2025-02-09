package com.example.profile.rabbitmq;

import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.example.profile.exception.MessageBrokerException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
                    eventJson);
        } catch (Exception e) {
            log.error("Failed to send TeacherCreatedEvent. Error: {}", e.getMessage(), e);
            throw new MessageBrokerException("Failed to send TeacherCreatedEvent");
        }
    }
}