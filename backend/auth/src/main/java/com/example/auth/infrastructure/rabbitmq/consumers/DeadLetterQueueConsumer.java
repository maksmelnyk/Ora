package com.example.auth.infrastructure.rabbitmq.consumers;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.example.auth.infrastructure.rabbitmq.Constants;
import com.example.auth.infrastructure.rabbitmq.events.BaseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class DeadLetterQueueConsumer {
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = Constants.AUTH_DLQ_NAME)
    public void processDlqMessage(Message message) {
        String queue = message.getMessageProperties().getConsumerQueue();
        String messageId = message.getMessageProperties().getMessageId();
        String eventType = String.valueOf(message.getMessageProperties().getHeaders().get("__TypeId__"));

        log.error("DLQ message received: queue={}, messageId={}, eventType={}", queue, messageId, eventType);

        try {
            BaseEvent event = objectMapper.readValue(message.getBody(), BaseEvent.class);
            log.warn("Parsed DLQ Event: type={}, id={}, timestamp={}",
                    event.getEventType(), event.getEventId(), event.getTimestamp());
        } catch (Exception ex) {
            log.warn("Could not parse DLQ message payload. Raw body: {}", new String(message.getBody()), ex);
        }

        // TODO: Alert to Slack/Sentry, persist to DB, etc.
    }
}