package com.group.hotel.exception;

import com.group.hotel.common.response.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 1. Bắt lỗi logic nghiệp vụ do mình chủ động quăng ra
    @ExceptionHandler(AppException.class)
    public ResponseEntity<BaseResponse<Void>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        log.error("AppException: {}", ex.getMessage());
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(BaseResponse.error(errorCode.getCode(), ex.getMessage()));
    }

    // 2. Bắt lỗi Validate (Rất xịn: Trả về danh sách từng field bị lỗi)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        // Trả về data là 1 map chứa các trường lỗi để Frontend dễ bôi đỏ ô Input
        return ResponseEntity.badRequest()
                .body(new BaseResponse<>(400, "Dữ liệu đầu vào không hợp lệ", errors));
    }

    // 3. Bắt lỗi Security: Không có quyền truy cập (Vai trò không phù hợp)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<BaseResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("AccessDeniedException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(BaseResponse.error(403, "Bạn không có quyền thực hiện chức năng này!"));
    }

    // 4. Bắt lỗi Security: Sai tài khoản / mật khẩu lúc Login
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<BaseResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(BaseResponse.error(401, "Tài khoản hoặc mật khẩu không chính xác!"));
    }

    // 5. Bắt lỗi khóa ngoại Database (Ví dụ: Xóa phòng đã có người đặt)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<BaseResponse<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        log.error("DataIntegrityViolationException: ", ex);

        // Bắt lỗi khóa ngoại liên quan đến bảng đặt phòng (bookings)
        if (ex.getMessage() != null && ex.getMessage().contains("bookings")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.error(400, "Không thể thao tác vì dữ liệu này đang được liên kết với một Hóa đơn đặt phòng!"));
        }

        // Bắt các lỗi khóa ngoại chung chung khác
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.error(400, "Không thể xóa hoặc sửa dữ liệu này vì nó đang được sử dụng ở nơi khác!"));
    }

    // 6. Bắt trọn ổ các lỗi còn lại (Tránh lộ stacktrace ra Frontend)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Void>> handleException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(BaseResponse.error(500, "Hệ thống đang gặp sự cố, vui lòng thử lại sau!"));
    }


    @ExceptionHandler(FurnitureNotFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleFurnitureNotFound(FurnitureNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(FurnitureConflictException.class)
    public ResponseEntity<BaseResponse<Void>> handleFurnitureConflict(FurnitureConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(BaseResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(RoomConflictException.class)
    public ResponseEntity<BaseResponse<Void>> handleRoomConflict(RoomConflictException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(BaseResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleRoomNotFound(RoomNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleReviewNotFound(ReviewNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(ReviewConflictException.class)
    public ResponseEntity<BaseResponse<Void>> handleReviewConflict(ReviewConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(BaseResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {

        // Tạo một object JSON chứa trường "message" để Front-end dễ lấy
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage()); // ex.getMessage() chính là "Tên đăng nhập đã tồn tại!"

        // Trả về mã 400 Bad Request kèm nội dung lỗi
        return ResponseEntity.badRequest().body(response);
    }

}
