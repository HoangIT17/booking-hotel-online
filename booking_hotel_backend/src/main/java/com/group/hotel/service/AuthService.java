package com.group.hotel.service;

import com.group.hotel.dto.request.ChangePasswordRequest;
import com.group.hotel.dto.request.LoginRequest;
import com.group.hotel.dto.request.RegisterRequest;
import com.group.hotel.dto.response.LoginResponse;
import com.group.hotel.dto.response.RegisterResponse;

public interface AuthService {
    void register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void changePassword(ChangePasswordRequest request);
}