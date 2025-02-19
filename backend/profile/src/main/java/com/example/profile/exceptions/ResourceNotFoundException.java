package com.example.profile.exceptions;

public class ResourceNotFoundException extends BaseAppException {
    public ResourceNotFoundException(String message, String errorCode) {
        super(message, errorCode);
    }
}