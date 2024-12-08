package com.example.auth.rabbitmq;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "app.rabbitmq")
public class RabbitMQProperties {
    private String userExchange;
    private String userCreatedRoutingKey;
    private String userCreatedQueue;
    private String userResponseQueue;
}