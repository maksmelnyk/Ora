package com.example.auth.infrastructure.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.stereotype.Service;

import com.example.auth.exceptions.AuthenticationException;
import com.example.auth.exceptions.ErrorCodes;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

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
                throw new AuthenticationException("Invalid token type", ErrorCodes.AUTHORIZATION_FAILED);
            }

            return UUID.fromString(claims.getSubject());

        } catch (ExpiredJwtException e) {
            throw new AuthenticationException("Token has expired", ErrorCodes.AUTHORIZATION_FAILED, e);
        } catch (JwtException | IllegalArgumentException e) {
            throw new AuthenticationException("Invalid token", ErrorCodes.AUTHORIZATION_FAILED, e);
        }
    }
}