package com.example.profile.infrastructure.messaging.configs;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.profile.infrastructure.messaging.Constants;

@Configuration
public class QueueConfiguration {
    @Value("${app.rabbitmq.dlq-exchange}")
    private String deadLetterExchange;

    @Value("${app.rabbitmq.message-ttl}")
    private int messageTtl;

    @Bean
    Queue profileEventsQueue() {
        return QueueBuilder.durable(Constants.PROFILE_QUEUE_NAME)
                .withArgument("x-dead-letter-exchange", deadLetterExchange)
                .withArgument("x-dead-letter-routing-key", Constants.PROFILE_DLQ_ROUTING_KEY)
                .withArgument("x-message-ttl", messageTtl)
                .build();
    }

    @Bean
    Queue profileEventsDlq() {
        return QueueBuilder.durable(Constants.PROFILE_DLQ_NAME)
                .build();
    }

    @Bean
    Binding profileQueueBindingFromAuth(Queue profileEventsQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(profileEventsQueue)
                .to(topicExchange)
                .with(Constants.AUTH_TO_PROFILE_PATTERN);
    }

    @Bean
    Binding profileQueueBindingFromLearning(Queue profileEventsQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(profileEventsQueue)
                .to(topicExchange)
                .with(Constants.LEARNING_TO_PROFILE_PATTERN);
    }

    @Bean
    Binding profileDlqBinding(Queue profileEventsDlq, TopicExchange deadLetterExchange) {
        return BindingBuilder.bind(profileEventsDlq)
                .to(deadLetterExchange)
                .with(Constants.PROFILE_DLQ_ROUTING_KEY);
    }
}
