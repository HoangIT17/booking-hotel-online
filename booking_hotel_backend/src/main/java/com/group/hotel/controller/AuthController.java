package com.group.hotel.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.auth.ChangePasswordRequest;
import com.group.hotel.dto.request.auth.LoginRequest;
import com.group.hotel.dto.request.auth.LogoutRequest;
import com.group.hotel.dto.request.auth.RegisterRequest;
import com.group.hotel.dto.response.auth.LoginResponse;
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

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(BaseResponse.success(null, "Đăng ký tài khoản thành công!"));
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ResponseEntity.ok(BaseResponse.success(loginResponse, "Đăng nhập thành công!"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<BaseResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(BaseResponse.success(null, "Đổi mật khẩu thành công!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<BaseResponse<Void>> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(BaseResponse.success(null, "Đăng xuất thành công!"));
    }
}