package com.group.hotel.dto.request;

import lombok.Data;

@Data
public class CreateIncidentRequest {
    private String roomNumber;
    private Long furnitureItemId;
    private String incidentType; // "DAMAGED" hoặc "MISSING"
    private String description;
}