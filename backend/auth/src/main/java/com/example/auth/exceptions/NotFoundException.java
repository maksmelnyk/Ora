package com.example.auth.exceptions;

public class NotFoundException extends BaseAppException {
    public NotFoundException(String message, String code) {
        super(message, code);
    }
}