package com.example.profile.exceptions;

public class ConflictException extends BaseAppException {
    public ConflictException(String message, String code) {
        super(message, code);
    }
}