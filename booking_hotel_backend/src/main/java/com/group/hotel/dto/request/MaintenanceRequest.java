package com.group.hotel.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MaintenanceRequest {
    private String roomNumber;

    private Long furnitureItemId;

    private String incidentDescription;

    private MultipartFile image;
}
