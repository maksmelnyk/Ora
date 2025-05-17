package com.example.profile.infrastructure.identity;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.profile.exceptions.UnauthorizedException;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class CurrentUser {
    private final SecurityContextProvider securityContextProvider;

    public UUID getUserId() {
        Authentication authentication = securityContextProvider.getContext().map(SecurityContext::getAuthentication)
                .orElse(null);
        if (authentication != null && authentication.isAuthenticated()) {
            return UUID.fromString(authentication.getName());
        }
        throw new UnauthorizedException("User is not authenticated");
    }
}

@Component
class SecurityContextProvider {
    public Optional<SecurityContext> getContext() {
        return Optional.ofNullable(SecurityContextHolder.getContext());
    }
}