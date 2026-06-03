package com.group.hotel.dto.request.room;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateRoomStatusRequest {

//    @NotBlank
    private String status;
}