package com.group.hotel.room.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FurnitureInRoomTypeResponse {
    private String furnitureName;
    private String iconName;
    private Integer quantity;
}
