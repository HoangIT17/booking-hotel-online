package com.group.hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    // Thêm trường message nếu muốn hiển thị thông báo cho người dùng
    private String message;

    // Constructor dùng cho Controller: new ApiResponse(true, data)
    public ApiResponse(boolean success, T data) {
        this.success = success;
        this.data = data;
    }

    // Static method để dùng: ApiResponse.success(data)
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data);
    }
}