package com.group.hotel.dto.response;

import com.group.hotel.enums.IncidentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FurnitureItemResponse {

    private Long furnitureId;

    private String furnitureName;

    private String furnitureType;

    private Integer quantity;

    private String description;

    private IncidentStatus incidentStatus;
}