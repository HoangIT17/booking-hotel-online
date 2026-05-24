package com.group.hotel.controller.admin;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.UserCreateRequest;
import com.group.hotel.dto.request.UserUpdateRequest;
import com.group.hotel.dto.response.UserCreateResponse;
import com.group.hotel.dto.response.UserResponse;
import com.group.hotel.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')") // 🛡️ BẢO VỆ TOÀN BỘ CLASS CHO ADMIN
public class UserController {

    private final UserService userService;

    /**
     * API: Tạo tài khoản nội bộ
     * URI: POST /api/v1/users
     */
    @PostMapping
    public ResponseEntity<BaseResponse<UserCreateResponse>> createAccount(@Valid @RequestBody UserCreateRequest request) {
        UserCreateResponse responseData = userService.createUser(request);
        return ResponseEntity.ok(BaseResponse.success(responseData, "Khởi tạo tài khoản thành công!"));
    }

    /**
     * API: Lấy danh sách người dùng
     * URI: GET /api/v1/users
     */
    @GetMapping
    public ResponseEntity<BaseResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Page<UserResponse> users = userService.getAllUsers(page, size, keyword, role, isActive, sortBy, sortDir);
        return ResponseEntity.ok(BaseResponse.success(users, "Lấy danh sách người dùng thành công"));
    }

    /**
     * API: Xem chi tiết người dùng
     * URI: GET /api/v1/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(userService.getUserById(id), "Lấy thông tin người dùng thành công"));
    }

    /**
     * API: Cập nhật người dùng
     * URI: PUT /api/v1/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<UserResponse>> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(BaseResponse.success(userService.updateUser(id, request), "Cập nhật người dùng thành công"));
    }

    /**
     * API: Xóa người dùng
     * URI: DELETE /api/v1/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(BaseResponse.success(null, "Xóa tài khoản thành công"));
    }
}