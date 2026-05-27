package com.group.hotel.dto.request;

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
    private String icon;
    private String description;
}
