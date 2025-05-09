package com.example.auth.infrastructure.rabbitmq.publishers;

import java.util.concurrent.TimeUnit;

import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.example.auth.infrastructure.rabbitmq.Constants;
import com.example.auth.infrastructure.rabbitmq.events.BaseEvent;
import com.example.auth.infrastructure.rabbitmq.events.RegistrationInitiatedEvent;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class EventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishEvent(String routingKey, BaseEvent event) {
        try {
            CorrelationData correlationData = new CorrelationData(event.getEventId());
            MessagePostProcessor processor = message -> {
                MessageProperties props = message.getMessageProperties();
                props.setHeader("__TypeId__", event.getEventType());
                props.setContentType(MessageProperties.CONTENT_TYPE_JSON);
                props.setContentEncoding("UTF-8");
                return message;
            };

            rabbitTemplate.convertAndSend(routingKey, event, processor, correlationData);

            boolean confirmed = correlationData.getFuture().get(5, TimeUnit.SECONDS).isAck();
            if (!confirmed) {
                throw new IllegalStateException("Message not confirmed by broker");
            }
        } catch (Exception e) {
            log.error("Failed to publish event: {}", event.getEventId(), e);
            // TODO: Consider storing failed messages for retry
            throw new RuntimeException("Failed to publish message", e);
        }
    }

    public void publishRegistrationInitiated(RegistrationInitiatedEvent event) {
        publishEvent(Constants.REGISTRATION_INITIATED_KEY, event);
    }
}
