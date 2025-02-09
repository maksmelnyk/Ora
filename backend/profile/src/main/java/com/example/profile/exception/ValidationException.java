package com.example.profile.exception;

public class ValidationException extends BaseAppException {
    public ValidationException(String message, String errorCode) {
        super(message, errorCode);
    }
}