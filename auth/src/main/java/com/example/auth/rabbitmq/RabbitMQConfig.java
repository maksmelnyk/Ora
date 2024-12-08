package com.example.auth.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class RabbitMQConfig {
    private final RabbitMQProperties properties;

    @Bean
    DirectExchange userExchange() {
        return new DirectExchange(properties.getUserExchange());
    }

    @Bean
    Queue userCreatedQueue() {
        return new Queue(properties.getUserCreatedQueue());
    }

    @Bean
    Queue userResponseQueue() {
        return new Queue(properties.getUserResponseQueue());
    }

    @Bean
    Binding userCreationBinding(Queue userCreatedQueue, DirectExchange userExchange) {
        return BindingBuilder.bind(userCreatedQueue).to(userExchange).with(properties.getUserCreatedRoutingKey());
    }

    @Bean
    Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        template.setReplyTimeout(1 * 60 * 1000);
        return template;
    }
}