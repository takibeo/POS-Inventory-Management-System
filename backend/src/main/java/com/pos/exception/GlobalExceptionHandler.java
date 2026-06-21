package com.pos.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import com.pos.exception.ValidationException;
import com.pos.exception.AppErrorCodes;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    //1. Validation loi tren @RequestBody (@Valid)
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String field = ((FieldError)error).getField();
            fieldErrors.put(field, error.getDefaultMessage());
        });

        ErrorResponse body = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                AppErrorCodes.VALIDATION_ERROR,
                "Dữ liệu đầu vào không hợp lệ",
                extractPath(request)
        );
        body.setFieldErrors(fieldErrors);

        return new ResponseEntity<>(body, headers, status);
    }

    // 2. Validation lỗi trên @PathVariable / @RequestParam
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex, WebRequest request){
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(v ->{
            String field = v.getPropertyPath().toString();
            fieldErrors.put(field, v.getMessage());
        });

        ErrorResponse body = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                AppErrorCodes.VALIDATION_ERROR,
                "Tham số không hợp lệ",
                extractPath(request)
        );
        body.setFieldErrors(fieldErrors);

        return ResponseEntity.badRequest().body(body);
    }

    // 3. Resource không tìm thấy → 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                AppErrorCodes.RESOURCE_NOT_FOUND,
                ex.getMessage(),
                extractPath(request)
        ));
    }

    // 4. Lỗi nghiệp vụ → 422
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex, WebRequest request) {

        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(new ErrorResponse(
                        HttpStatus.UNPROCESSABLE_ENTITY.value(),
                        ex.getErrorCode(),
                        ex.getMessage(),
                        extractPath(request)
                ));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            ValidationException ex, WebRequest request) {

        ErrorResponse body = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getErrorCode(),
                ex.getMessage(),
                extractPath(request)
        );
        body.setFieldErrors(ex.getFieldErrors());
        return ResponseEntity.badRequest().body(body);
    }

    // 5. Chưa đăng nhập → 401
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(),
                        AppErrorCodes.UNAUTHORIZED,
                        "Bạn cần đăng nhập để thực hiện thao tác này",
                        extractPath(request)
                ));
    }

    // 6. Không có quyền → 403
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(
                        HttpStatus.FORBIDDEN.value(),
                        AppErrorCodes.FORBIDDEN,
                        "Bạn không có quyền thực hiện thao tác này",
                        extractPath(request)
                ));
    }

    // 7. Catch-all lỗi không mong đợi → 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {

        logger.error("Unhandled exception at " + extractPath(request), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        AppErrorCodes.INTERNAL_ERROR,
                        "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau",
                        extractPath(request)
                ));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            org.springframework.http.converter.HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        ErrorResponse body = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                AppErrorCodes.INVALID_JSON,
                "Yêu cầu JSON không hợp lệ",
                extractPath(request)
        );
        return new ResponseEntity<>(body, headers, status);
    }

    private String extractPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }

}
