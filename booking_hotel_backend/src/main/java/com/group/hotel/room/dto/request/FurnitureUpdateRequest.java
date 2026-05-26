package com.group.hotel.room.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FurnitureUpdateRequest {
    @NotBlank
    private String furnitureName;
    @NotBlank
    private String furnitureType;
    @NotBlank
    private String iconName;
    private String description;
}
