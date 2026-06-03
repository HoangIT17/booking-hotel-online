package com.group.hotel.dto.request.user;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserCreateRequest {

    @NotBlank(message = "Username không được để trống")
    @Size(min = 5, max = 50, message = "Username phải từ 5-50 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username không được chứa ký tự đặc biệt")
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 8, max = 255, message = "Password phải từ 8-255 ký tự")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng Email không hợp lệ")
    @Size(min = 10, max = 100, message = "Email phải từ 10-100 ký tự")
    private String email;

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 5, max = 100, message = "Họ tên phải từ 5-100 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(min = 10, max = 15, message = "Số điện thoại phải từ 10-15 ký tự")
    @Pattern(regexp = "^[0-9]+$", message = "Số điện thoại chỉ được chứa chữ số")
    private String phone;

    @NotNull(message = "Role ID không được để trống")
    private Long roleId;
}