package com.group.hotel.dto.request.maintenance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateMaintenanceRequest {

    @NotBlank
    @Size(min = 1, max = 10)
    private String roomNumber;

    @NotNull
    private Long furnitureItemId;

    @NotBlank
    @Size(min = 10, max = 100)
    private String incidentDescription;

    private MultipartFile image;
}