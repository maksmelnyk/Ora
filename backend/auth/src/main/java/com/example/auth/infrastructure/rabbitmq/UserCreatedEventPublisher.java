package com.example.auth.infrastructure.rabbitmq;

import com.example.auth.exceptions.AuthenticationException;
import com.example.auth.exceptions.ErrorCodes;
import com.example.auth.infrastructure.rabbitmq.UserCreatedEvent.UserCreationStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserCreatedEventPublisher {
    private final RabbitTemplate template;
    private final RabbitMQProperties properties;
    private final ObjectMapper objectMapper;

    public UserCreationStatus publishUserCreationEvent(UserCreatedEvent event) {
        try {
            String eventJson = this.objectMapper.writeValueAsString(event);
            String responseJson = (String) this.template.convertSendAndReceive(
                    this.properties.getUserExchange(),
                    this.properties.getUserCreatedRoutingKey(),
                    eventJson);
            if (responseJson == null) {
                throw new AuthenticationException("Error during user login", ErrorCodes.USER_ROLE_ASSIGNMENT_FAILED);
            }

            UserCreatedEvent responseEvent = this.objectMapper.readValue(responseJson, UserCreatedEvent.class);
            return responseEvent.getStatus();

        } catch (Exception e) {
            throw new AuthenticationException("Failed to create user", ErrorCodes.USER_CREATION_FAILED, e);
        }
    }
}