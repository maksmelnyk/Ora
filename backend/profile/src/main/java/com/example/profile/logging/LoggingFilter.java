package com.example.profile.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class LoggingFilter extends OncePerRequestFilter {

    @Value("${server.name}")
    private String serviceName;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Instant start = Instant.now();

        MDC.put("service_name", serviceName);
        MDC.put("request_id", UUID.randomUUID().toString());
        MDC.put("http_method", request.getMethod());
        MDC.put("http_path", request.getRequestURI());
        MDC.put("http_query", request.getQueryString());
        MDC.put("client_ip", request.getRemoteAddr());

        String userId = getUserIdFromToken(request);
        MDC.put("user_id", userId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            Instant end = Instant.now();
            long durationMs = Duration.between(start, end).toMillis();
            MDC.put("duration_ms", String.valueOf(durationMs));

            int statusCode = response.getStatus();
            MDC.put("status_code", String.valueOf(statusCode));

            if (statusCode >= 500) {
                logger.error("Request completed with server error");
            } else if (statusCode >= 400) {
                logger.warn("Request completed with user error");
            } else {
                logger.info("Request completed successfully");
            }

            MDC.clear();
        }
    }

    private String getUserIdFromToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            String[] tokenParts = token.split("\\.");
            if (tokenParts.length != 3) {
                return "unknown";
            }

            String payload = tokenParts[1];
            while (payload.length() % 4 != 0) {
                payload += "=";
            }

            byte[] decodedBytes = Base64.getUrlDecoder().decode(payload);
            String decodedPayload = new String(decodedBytes, StandardCharsets.UTF_8);

            ObjectMapper mapper = new ObjectMapper();
            try {
                Map<String, Object> claims = mapper.readValue(decodedPayload, new TypeReference<Map<String, Object>>() {
                });
                return claims.get("sub").toString();
            } catch (Exception e) {
                return "unknown";
            }
        }
        return "unknown";
    }
}
