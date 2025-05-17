package com.example.profile.exceptions;

public class UnauthorizedException extends BaseAppException {
    public UnauthorizedException(String message) {
        super(message, ErrorCodes.AUTHORIZATION_FAILED);
    }
}