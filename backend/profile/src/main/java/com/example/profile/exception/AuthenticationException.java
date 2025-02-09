package com.example.profile.exception;

public class AuthenticationException extends BaseAppException {
    public AuthenticationException(String message, String errorCode) {
        super(message, errorCode);
    }
}