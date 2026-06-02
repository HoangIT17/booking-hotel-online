package com.group.hotel.dto.request.room;

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
    private String roomTypeName;
    private Boolean isDeleted;
}
