package com.example.auth.infrastructure.rabbitmq.events;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.PUBLIC_ONLY)
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class BaseEvent implements Serializable {
    private String eventType;
    private String eventId;
    @Setter
    private String correlationId;
    private String timestamp;

    protected BaseEvent() {
        this.eventId = UUID.randomUUID().toString();
        this.correlationId = UUID.randomUUID().toString();
        this.timestamp = Instant.now().toString();
    }

    protected void setEventType(String eventType) {
        this.eventType = eventType;
    }
}