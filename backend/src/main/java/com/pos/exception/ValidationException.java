package com.pos.exception;

import java.util.Collections;
import java.util.Map;

public class ValidationException extends RuntimeException {
    private final String errorCode;
    private final Map<String, String> fieldErrors;

    public ValidationException(String errorCode, String message) {
        this(errorCode, message, Collections.emptyMap());
    }

    public ValidationException(String errorCode, String message, Map<String, String> fieldErrors) {
        super(message);
        this.errorCode = errorCode;
        this.fieldErrors = fieldErrors;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
