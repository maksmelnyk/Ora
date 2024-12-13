package com.example.auth.rabbitmq;

import com.example.auth.exception.ErrorCodes;
import com.example.auth.exception.ResourceNotCreatedException;
import com.example.auth.keycloak.KeycloakClient;
import com.example.auth.keycloak.KeycloakRole;
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
            //TODO: fix exception
            throw new ResourceNotCreatedException("Failed to assing role", ErrorCodes.USER_CREATION_FAILED, e);
        }
    }
}