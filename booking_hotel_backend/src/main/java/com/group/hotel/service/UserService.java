package com.group.hotel.service;

import com.group.hotel.dto.request.user.UserCreateRequest;
import com.group.hotel.dto.request.user.UserUpdateRequest;
import com.group.hotel.dto.response.user.UserCreateResponse;
import com.group.hotel.dto.response.user.UserResponse;
import org.springframework.data.domain.Page;

public interface UserService {
    UserCreateResponse createUser(UserCreateRequest request);
    Page<UserResponse> getAllUsers(int page, int size, String keyword, String role, Boolean isActive, String sortBy, String sortDir);
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
}