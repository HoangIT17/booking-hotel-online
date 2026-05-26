package com.group.hotel.auth.service;

import com.group.hotel.auth.dto.request.ChangePasswordRequest;
import com.group.hotel.auth.dto.request.LoginRequest;
import com.group.hotel.auth.dto.request.LogoutRequest;
import com.group.hotel.auth.dto.request.RegisterRequest;
import com.group.hotel.auth.dto.response.LoginResponse;

public interface AuthService {
    void register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void changePassword(ChangePasswordRequest request);
    void logout(LogoutRequest request);
}