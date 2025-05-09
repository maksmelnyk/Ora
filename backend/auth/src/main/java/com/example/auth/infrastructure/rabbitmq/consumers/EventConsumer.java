package com.example.auth.infrastructure.rabbitmq.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.auth.AuthService;
import com.example.auth.infrastructure.rabbitmq.Constants;
import com.example.auth.infrastructure.rabbitmq.events.EducatorCreatedEvent;
import com.example.auth.infrastructure.rabbitmq.events.RegistrationCompletedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@RabbitListener(queues = Constants.AUTH_QUEUE_NAME)
public class EventConsumer {
    private final AuthService service;

    @RabbitHandler
    public void handle(RegistrationCompletedEvent event) {
        log.info("Received RegistrationCompletedEvent: {}", event);
        service.finalizeUserCreation(event.getUserId(), event.getSuccess());
    }

    @RabbitHandler
    public void handle(EducatorCreatedEvent event) {
        log.info("Received EducatorCreatedEvent: {}", event);
        service.assignEducatorRoleToUser(event.getUserId());
    }

    @RabbitHandler(isDefault = true)
    public void handleUnknown(Object unknown) {
        log.warn("Received unknown event type: {}", unknown.getClass().getName());
    }
}