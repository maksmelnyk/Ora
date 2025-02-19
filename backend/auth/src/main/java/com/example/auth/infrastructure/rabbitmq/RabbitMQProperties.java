package com.example.auth.infrastructure.rabbitmq;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.rabbitmq")
public class RabbitMQProperties {
    private String userExchange;
    private String userCreatedRoutingKey;
    private String userCreatedQueue;
    private String userResponseQueue;
    private String teacherExchange;
    private String teacherCreatedQueue;
    private String teacherCreatedRoutingKey;
}