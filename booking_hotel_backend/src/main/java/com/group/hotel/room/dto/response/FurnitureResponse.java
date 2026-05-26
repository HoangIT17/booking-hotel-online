package com.group.hotel.room.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FurnitureResponse {
    private Long id;
    private String furnitureName;
    private String furnitureType;
    private String iconName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
