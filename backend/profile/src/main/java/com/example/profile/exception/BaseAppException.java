package com.example.profile.exception;

import lombok.Getter;

@Getter
public class BaseAppException extends RuntimeException {
    private final String errorCode;

    public BaseAppException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
