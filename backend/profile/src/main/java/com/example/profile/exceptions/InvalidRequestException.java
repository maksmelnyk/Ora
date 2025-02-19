package com.example.profile.exceptions;

public class InvalidRequestException extends BaseAppException {
    public InvalidRequestException(String message, String errorCode) {
        super(message, errorCode);
    }
}
