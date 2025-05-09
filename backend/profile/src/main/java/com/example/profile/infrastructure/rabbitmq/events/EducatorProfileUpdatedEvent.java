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
public class EducatorProfileUpdatedEvent extends BaseEvent {
    private String userId;
    private String firstName;
    private String lastName;
    private String imageUrl;

    public EducatorProfileUpdatedEvent(String userId, String firstName, String lastName, String imageUrl) {
        super();
        setEventType(Constants.EDUCATOR_PROFILE_UPDATED);
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageUrl = imageUrl;
    }
}