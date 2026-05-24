package com.group.hotel.controller.auth;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.ChangePasswordRequest;
import com.group.hotel.dto.request.LoginRequest;
import com.group.hotel.dto.request.RegisterRequest;
import com.group.hotel.dto.response.LoginResponse;
import com.group.hotel.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * API: Đăng ký tài khoản mới.
     * URI: POST /api/v1/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<BaseResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(BaseResponse.success(null, "Đăng ký tài khoản thành công!"));
    }

    /**
     * API: Đăng nhập.
     * URI: POST /api/v1/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ResponseEntity.ok(BaseResponse.success(loginResponse, "Đăng nhập thành công!"));
    }

    /**
     * API: Đổi mật khẩu.
     * URI: PUT /api/v1/auth/change-password
     */
    @PutMapping("/change-password")
    public ResponseEntity<BaseResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(BaseResponse.success(null, "Đổi mật khẩu thành công!"));
    }
}