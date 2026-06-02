package com.group.hotel.service;

import com.group.hotel.dto.request.auth.ChangePasswordRequest;
import com.group.hotel.dto.request.auth.LoginRequest;
import com.group.hotel.dto.request.auth.LogoutRequest;
import com.group.hotel.dto.request.auth.RegisterRequest;
import com.group.hotel.dto.response.auth.LoginResponse;

public interface AuthService {
    void register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void changePassword(ChangePasswordRequest request);
    void logout(LogoutRequest request);
}