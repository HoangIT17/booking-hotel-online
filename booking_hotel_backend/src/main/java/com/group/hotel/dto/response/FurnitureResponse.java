package com.group.hotel.dto.response;

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
    private String icon;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
