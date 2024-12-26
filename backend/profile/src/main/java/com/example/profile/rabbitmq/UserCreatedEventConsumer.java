package com.example.profile.rabbitmq;

import com.example.profile.userProfile.UserProfile;
import com.example.profile.userProfile.UserProfileMapper;
import com.example.profile.userProfile.UserProfileRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

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
            // TODO: Handle response sending errors (e.g., log them)
            System.err.println("Failed to send response: " + e.getMessage());
        }
    }

    private void validateUserCreationEvent(UserCreatedEvent event) {
        // TODO: Add additional validation as needed
        if (event.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
    }
}