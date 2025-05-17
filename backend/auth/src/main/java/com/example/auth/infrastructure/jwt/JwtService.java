package com.example.auth.infrastructure.jwt;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.example.auth.exceptions.UnauthorizedException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class JwtService {
    private static final SecretKey SECRET_KEY = Jwts.SIG.HS512.key().build();

    public String generateStatusToken(UUID userId) {
        Instant now = Instant.now();

        Instant expiry = now.plusMillis(10 * 60 * 1000);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("type", "registration_status")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(SECRET_KEY)
                .compact();
    }

    public UUID validateStatusTokenAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String type = claims.get("type", String.class);
            if (!"registration_status".equals(type)) {
                throw new UnauthorizedException("Invalid token");
            }

            return UUID.fromString(claims.getSubject());

        } catch (Exception e) {
            log.error("Failed to validate token: {}", e.getMessage());
            throw new UnauthorizedException("Invalid token");
        }
    }
}