package com.group.hotel.user.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserCreateResponse {
    private String message;
    private Long userId;
}