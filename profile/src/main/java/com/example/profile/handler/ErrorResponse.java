package com.example.profile.handler;

public record ErrorResponse(
        String errorCode,
        String errorMessage) {
}