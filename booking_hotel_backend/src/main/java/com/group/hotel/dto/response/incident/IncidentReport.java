package com.group.hotel.dto.response.incident;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IncidentReport {
    private Long id;
    private String roomNumber;
    private String furnitureName;
    private String description;
    private String staffName;
    private String status;
    private String createdAt;
}
