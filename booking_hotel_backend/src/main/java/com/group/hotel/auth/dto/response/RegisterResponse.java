package com.group.hotel.auth.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Builder
public class RegisterResponse {
    private Long userId;
    private String username;
    private String email;
    private String fullName;
}