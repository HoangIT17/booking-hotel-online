package com.group.hotel.user.service;

import com.group.hotel.user.dto.request.UserCreateRequest;
import com.group.hotel.user.dto.request.UserUpdateRequest;
import com.group.hotel.user.dto.response.UserCreateResponse;
import com.group.hotel.user.dto.response.UserResponse;
import org.springframework.data.domain.Page;

public interface UserService {
    UserCreateResponse createUser(UserCreateRequest request);
    Page<UserResponse> getAllUsers(int page, int size, String keyword, String role, Boolean isActive, String sortBy, String sortDir);
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
}