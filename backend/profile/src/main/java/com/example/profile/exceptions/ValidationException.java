package com.example.profile.exceptions;

public class ValidationException extends BaseAppException {
    public ValidationException(String message, String errorCode) {
        super(message, errorCode);
    }
}