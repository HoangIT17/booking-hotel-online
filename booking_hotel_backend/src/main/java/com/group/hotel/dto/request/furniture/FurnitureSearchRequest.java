package com.group.hotel.dto.request.furniture;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FurnitureSearchRequest {
    private String furnitureType;
    private String furnitureName;
}
