package com.pos.exception;

import java.time.Instant;
import java.util.Map;
import java.util.LinkedHashMap;

public class ErrorResponse {
    private Instant timestamp;
    private int status;
    private String errorCode;
    private String message;
    private String path;
    private Map<String, String> fieldErrors;

    public ErrorResponse() {
    }

    public ErrorResponse(int status, String errorCode, String message, String path) {
        this.timestamp = Instant.now();
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
        this.path = path;
        this.fieldErrors = new LinkedHashMap<>();
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}
