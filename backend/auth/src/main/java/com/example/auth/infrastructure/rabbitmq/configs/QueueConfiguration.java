package com.example.auth.infrastructure.rabbitmq.configs;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.auth.infrastructure.rabbitmq.Constants;

@Configuration
public class QueueConfiguration {
    @Value("${app.rabbitmq.dlq-exchange}")
    private String deadLetterExchange;

    @Value("${app.rabbitmq.message-ttl}")
    private int messageTtl;

    @Bean
    Queue authEventsQueue() {
        return QueueBuilder.durable(Constants.AUTH_QUEUE_NAME)
                .withArgument("x-dead-letter-exchange", deadLetterExchange)
                .withArgument("x-dead-letter-routing-key", Constants.AUTH_DLQ_ROUTING_KEY)
                .withArgument("x-message-ttl", messageTtl)
                .build();
    }

    @Bean
    Queue authEventsDlq() {
        return QueueBuilder.durable(Constants.AUTH_DLQ_NAME).build();
    }

    @Bean
    Binding authQueueBinding(Queue authEventsQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(authEventsQueue)
                .to(topicExchange)
                .with(Constants.PROFILE_TO_AUTH_PATTERN);
    }

    @Bean
    Binding authDlqBinding(Queue authEventsDlq, TopicExchange deadLetterExchange) {
        return BindingBuilder.bind(authEventsDlq)
                .to(deadLetterExchange)
                .with(Constants.AUTH_DLQ_ROUTING_KEY);
    }
}
