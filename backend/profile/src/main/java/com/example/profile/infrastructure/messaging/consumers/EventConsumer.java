package com.example.profile.infrastructure.messaging.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.profile.features.educatorProfile.EducatorProfileService;
import com.example.profile.features.userProfile.UserProfileService;
import com.example.profile.infrastructure.messaging.Constants;
import com.example.profile.infrastructure.messaging.events.EducatorProductCreatedEvent;
import com.example.profile.infrastructure.messaging.events.RegistrationInitiatedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@RabbitListener(queues = Constants.PROFILE_QUEUE_NAME)
public class EventConsumer {
    private final UserProfileService profileService;
    private final EducatorProfileService educatorService;

    @RabbitHandler
    public void handle(RegistrationInitiatedEvent event) {
        log.info("Received RegistrationInitiatedEvent: {}", event);
        profileService.createUserProfile(event);
    }

    @RabbitHandler
    public void handle(EducatorProductCreatedEvent event) {
        log.info("Received EducatorProductCreatedEvent: {}", event);
        educatorService.setEducatorHasProduct(event.getUserId());
    }

    @RabbitHandler(isDefault = true)
    public void handleUnknown(Object unknown) {
        log.warn("Received unknown event type: {}", unknown.getClass().getName());
    }
}