package com.example.auth.infrastructure.rabbitmq;

import com.example.auth.exceptions.ErrorCodes;
import com.example.auth.exceptions.ResourceNotCreatedException;
import com.example.auth.infrastructure.keycloak.KeycloakClient;
import com.example.auth.infrastructure.keycloak.KeycloakRole;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TeacherCreatedEventConsumer {
    private final KeycloakClient client;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "${app.rabbitmq.teacherCreatedQueue}")
    public void handleTeacherCreatedEvent(String eventJson) {
        try {
            TeacherCreatedEvent event = this.objectMapper.readValue(eventJson, TeacherCreatedEvent.class);
            this.client.assignRoleToUser(event.getUserId().toString(), KeycloakRole.TEACHER);
        } catch (Exception e) {
            // TODO: fix exception
            throw new ResourceNotCreatedException("Failed to assing role", ErrorCodes.USER_CREATION_FAILED, e);
        }
    }
}