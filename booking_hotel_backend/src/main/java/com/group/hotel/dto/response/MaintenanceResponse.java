package com.group.hotel.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceResponse {
    private String ticketId;
    private String status;
}