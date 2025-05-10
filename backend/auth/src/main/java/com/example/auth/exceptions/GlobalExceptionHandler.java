package com.example.auth.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(ValidationException ex) {
        return buildErrorResponse(ex.getMessage(), ex.getErrorCode(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException ex) {
        return buildErrorResponse(ex.getMessage(), ex.getErrorCode(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotCreatedException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotCreatedException(ResourceNotCreatedException ex) {
        return buildErrorResponse(ex.getMessage(), ex.getErrorCode(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return buildErrorResponse("An unexpected error occurred", "INTERNAL_SERVER_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, String errorCode,
            HttpStatus status) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", message);
        errorResponse.put("code", errorCode);
        return new ResponseEntity<>(errorResponse, status);
    }
}