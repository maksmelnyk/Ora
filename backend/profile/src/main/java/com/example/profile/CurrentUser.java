package com.example.profile;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.AuthenticationException;

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
        throw new AuthenticationException("User is not authenticated", ErrorCodes.USER_NOT_AUTHENTICATED);
    }
}

@Component
class SecurityContextProvider {
    public Optional<SecurityContext> getContext() {
        return Optional.ofNullable(SecurityContextHolder.getContext());
    }
}