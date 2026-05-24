package com.group.hotel.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {


    private Long id;
    private String username;
    private String email;
    private Boolean isActive;

    private String role;


    private String fullName;
    private String phone;
    private String address;
    private String avatar;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}