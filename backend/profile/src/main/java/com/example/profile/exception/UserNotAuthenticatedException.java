package com.example.profile.exception;

import lombok.Getter;

@Getter
public class UserNotAuthenticatedException extends RuntimeException {
    private final String errorCode;

    public UserNotAuthenticatedException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}