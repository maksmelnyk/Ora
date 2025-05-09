package com.example.profile.infrastructure.rabbitmq.events;

import com.example.profile.infrastructure.rabbitmq.Constants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class RegistrationCompletedEvent extends BaseEvent {
    private String userId;
    private Boolean success;
    private String message;

    public RegistrationCompletedEvent(String userId, Boolean success, String message) {
        super();
        setEventType(Constants.REGISTRATION_COMPLETED);
        this.userId = userId;
        this.success = success;
        this.message = message;
    }
}