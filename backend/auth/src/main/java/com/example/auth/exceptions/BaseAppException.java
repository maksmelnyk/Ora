package com.example.auth.exceptions;

import lombok.Getter;

@Getter
public class BaseAppException extends RuntimeException {
    private final String code;

    public BaseAppException(String message, String code) {
        super(message);
        this.code = code;
    }
}