package com.example.profile.rabbitmq;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.example.profile.exception.MessageBrokerException;
import com.example.profile.userProfile.UserProfile;
import com.example.profile.userProfile.UserProfileMapper;
import com.example.profile.userProfile.UserProfileRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class UserCreatedEventConsumer {
    private final UserProfileRepository profileRepository;
    private final RabbitTemplate rabbitTemplate;
    private final UserProfileMapper mapper;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "${app.rabbitmq.userCreatedQueue}")
    public void processUserCreation(String eventJson,
            @Header("amqp_correlationId") String correlationId,
            @Header("amqp_replyTo") String replyTo) {
        try {
            UserCreatedEvent event = objectMapper.readValue(eventJson, UserCreatedEvent.class);

            validateUserCreationEvent(event);

            UserProfile profile = mapper.toUserProfile(event);
            profileRepository.save(profile);

            event.setStatus(UserCreatedEvent.UserCreationStatus.CREATED);
            sendResponse(event, correlationId, replyTo);
        } catch (Exception e) {
            UserCreatedEvent event = new UserCreatedEvent();
            event.setStatus(UserCreatedEvent.UserCreationStatus.PROCESSING_ERROR);
            event.setErrorMessage("Error processing user creation: " + e.getMessage());
            log.error("Error processing user creation: {}", e.getMessage(), e);
            sendResponse(event, correlationId, replyTo);
        }
    }

    private void sendResponse(UserCreatedEvent event, String correlationId, String replyTo) {
        try {
            String responseJson = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend(replyTo, responseJson, message -> {
                message.getMessageProperties().setCorrelationId(correlationId);
                return message;
            });
        } catch (Exception e) {
            log.error("Error processing user creation: {}", e.getMessage(), e);
            throw new MessageBrokerException("Error processing user creation");
        }
    }

    private void validateUserCreationEvent(UserCreatedEvent event) {
        // TODO: Add additional validation as needed
        if (event.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
    }
}