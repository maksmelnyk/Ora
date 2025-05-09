package com.example.auth.middlewares;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests( // TODO: temporary allow OpenAPI docs APIs
                        a -> a.requestMatchers("/api/v1/auth/**", "/v3/api-docs/**", "/swagger-ui/**")
                                .permitAll().anyRequest().authenticated());

        return http.build();
    }
}