package com.example.profile.exception;

public class ResourceExistsException extends RuntimeException {
    private final String errorCode;

    public ResourceExistsException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}