package com.example.auth.rabbitmq;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.example.auth.exception.AuthenticationException;
import com.example.auth.exception.ErrorCodes;
import com.example.auth.rabbitmq.UserCreationEvent.UserCreationStatus;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserPublisherService {
    private final RabbitTemplate rabbitTemplate;
    private final RabbitMQProperties properties;
    private final ObjectMapper objectMapper;

    public UserCreationStatus createUserWithValidation(UserCreationEvent event) {
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            String responseJson = (String) rabbitTemplate.convertSendAndReceive(
                    properties.getUserExchange(),
                    properties.getUserCreatedRoutingKey(),
                    eventJson);
            if (responseJson == null) {
                throw new AuthenticationException("Error during user login", ErrorCodes.USER_ROLE_ASSIGNMENT_FAILED);
            }

            UserCreationEvent responseEvent = objectMapper.readValue(responseJson, UserCreationEvent.class);
            return responseEvent.getStatus();

        } catch (Exception e) {
            throw new AuthenticationException("Failed to create user", ErrorCodes.USER_CREATION_FAILED, e);
        }
    }
}