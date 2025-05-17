package com.example.auth.exceptions;

public class ConflictException extends BaseAppException {
    public ConflictException(String message, String code) {
        super(message, code);
    }
}