package com.example.profile.infrastructure.telemetry;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.otel")
public class TelemetryProperties {
    private String serviceName;
    private String endpoint;
    private Boolean enableTraces;
    private Boolean enableMetrics;
    private Boolean enableLogs;
}