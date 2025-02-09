package com.example.profile.exception;

public class ResourceNotFoundException extends BaseAppException {
    public ResourceNotFoundException(String message, String errorCode) {
        super(message, errorCode);
    }
}