package com.example.auth.infrastructure.messaging.events;

import com.example.auth.infrastructure.messaging.Constants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class EducatorCreatedEvent extends BaseEvent {
    private String userId;

    public EducatorCreatedEvent(String userId) {
        super();
        setEventType(Constants.EDUCATOR_CREATED);
        this.userId = userId;
    }
}