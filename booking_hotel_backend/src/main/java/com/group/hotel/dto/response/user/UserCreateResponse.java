package com.group.hotel.dto.response.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserCreateResponse {
    private String message;
    private Long userId;
}