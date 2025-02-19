package com.example.auth.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotCreatedException extends RuntimeException {
    private final String errorCode;

    public ResourceNotCreatedException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public ResourceNotCreatedException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}