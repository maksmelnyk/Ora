package com.example.auth.infrastructure.rabbitmq.events;

import java.time.LocalDate;

import com.example.auth.infrastructure.rabbitmq.Constants;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class RegistrationInitiatedEvent extends BaseEvent {
    private String userId;
    private String username;
    private String firstName;
    private String lastName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birthDate;

    public RegistrationInitiatedEvent(
            String userId,
            String username,
            String firstName,
            String lastName,
            LocalDate birthDate) {
        super();
        setEventType(Constants.REGISTRATION_INITIATED);
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
    }
}