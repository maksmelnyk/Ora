package com.example.auth.exception;

import lombok.Getter;

@Getter
public class ValidationException extends RuntimeException {
    private final String errorCode;

    public ValidationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}