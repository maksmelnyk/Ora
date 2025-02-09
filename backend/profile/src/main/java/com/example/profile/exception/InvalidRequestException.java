package com.example.profile.exception;

public class InvalidRequestException extends BaseAppException {
    public InvalidRequestException(String message, String errorCode) {
        super(message, errorCode);
    }
}
