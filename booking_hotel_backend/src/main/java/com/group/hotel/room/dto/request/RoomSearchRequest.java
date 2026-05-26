package com.group.hotel.room.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomSearchRequest {
    private String roomNumber;
    private Integer floor;
    private String status;
    private Long roomTypeId;
    private Boolean isDeleted;
}
