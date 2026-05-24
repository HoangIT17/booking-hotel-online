package com.group.hotel.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FurnitureUpdateRequest {
    private String furnitureName;
    private String furnitureType;
    private String iconName;
    private String description;
}
