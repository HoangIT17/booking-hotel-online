package com.group.hotel.room.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeFurnitureRequest {
    private List<FurnitureItem> furnitures;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FurnitureItem {
        private Long furnitureId;
        private Integer quantity;
    }
}
