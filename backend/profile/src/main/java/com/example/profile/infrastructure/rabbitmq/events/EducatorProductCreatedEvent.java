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
public class EducatorProductCreatedEvent extends BaseEvent {
    private String userId;

    public EducatorProductCreatedEvent(String userId) {
        super();
        setEventType(Constants.EDUCATOR_PRODUCT_CREATED);
        this.userId = userId;
    }
}