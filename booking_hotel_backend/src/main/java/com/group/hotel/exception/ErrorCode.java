package com.group.hotel.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    OLD_PASSWORD_INCORRECT(1005, "Mật khẩu hiện tại không chính xác", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_MATCH(1006, "Mật khẩu xác nhận không khớp với mật khẩu mới", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_CANNOT_BE_SAME(1007, "Mật khẩu mới không được trùng với mật khẩu hiện tại", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS(401, "Tài khoản hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED),
    USER_NOT_FOUND(404, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    USER_IS_LOCKED(400, "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(400, "Username đã tồn tại trong hệ thống", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(400, "Email đã tồn tại trong hệ thống", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(400, "Role không hợp lệ hoặc không tồn tại", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(401, "Bạn chưa đăng nhập hoặc token hết hạn", HttpStatus.UNAUTHORIZED),
    TOKEN_NOT_FOUND(1008, "Token không hợp lệ hoặc không tồn tại", HttpStatus.BAD_REQUEST),
    FORBIDDEN(403, "Bạn không có quyền thực hiện hành động này", HttpStatus.FORBIDDEN);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}