package com.group.hotel.exception;


import com.group.hotel.common.response.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(FurnitureConflictException.class)
    public ResponseEntity<BaseResponse<Void>> handleFurnitureConflict(FurnitureConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(BaseResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(FurnitureNotFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleFurnitureNotFound(FurnitureNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.error(400, message));
    }
}