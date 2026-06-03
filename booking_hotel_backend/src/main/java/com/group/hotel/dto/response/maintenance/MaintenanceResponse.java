package com.group.hotel.dto.response.maintenance;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MaintenanceResponse {

    private String ticketId;

    private String status;
}