package com.group.hotel.dto.response.room;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateRoomStatusResponse {

    private Boolean success;

    private String message;
}