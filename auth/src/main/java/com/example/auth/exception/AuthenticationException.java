package com.example.auth.exception;

public class AuthenticationException extends RuntimeException {
    private final String errorCode;

    public AuthenticationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public AuthenticationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}