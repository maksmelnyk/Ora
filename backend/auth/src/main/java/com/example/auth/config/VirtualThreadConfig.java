package com.example.auth.config;

import java.util.concurrent.Executors;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VirtualThreadConfig {
    @Bean
    WebServerFactoryCustomizer<TomcatServletWebServerFactory> customizer() {
        return factory -> factory.addConnectorCustomizers(connector -> {
            connector.getProtocolHandler().setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        });
    }
}
