package com.group.hotel.room.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FurnitureCreateRequest {
    @NotBlank
    private String furnitureName;
    @NotBlank
    private String furnitureType;
    @NotBlank
    private String iconName;
    @NotBlank
    private String description;
}
