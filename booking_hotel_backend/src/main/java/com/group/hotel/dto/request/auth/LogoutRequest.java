package com.group.hotel.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LogoutRequest {
    @NotBlank(message = "Refresh Token không được để trống")
    private String refreshToken;
}