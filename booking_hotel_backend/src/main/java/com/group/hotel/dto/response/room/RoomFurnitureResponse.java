package com.group.hotel.dto.response.room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomFurnitureResponse {
    private Long id;
    private String furnitureName;
    private String furnitureType;
    private String icon;
    private String description;
}
