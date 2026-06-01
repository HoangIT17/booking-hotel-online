package com.group.hotel.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateRoomStatusRequest {

//    @NotBlank
    private String status;
}