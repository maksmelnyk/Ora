package com.example.profile;

import com.example.profile.exception.ErrorCodes;
import com.example.profile.exception.UserNotAuthenticatedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CurrentUser {
    public UUID getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return UUID.fromString(authentication.getName());
        }
        throw new UserNotAuthenticatedException("User is not authenticated", ErrorCodes.USER_NOT_AUTHENTICATED);
    }
}