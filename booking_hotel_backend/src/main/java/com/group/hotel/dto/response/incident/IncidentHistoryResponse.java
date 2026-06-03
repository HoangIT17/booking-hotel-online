package com.group.hotel.dto.response.incident;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentHistoryResponse {

    private Long id;

    private String description;

    private String status;

    private String reportedBy;

    private LocalDateTime createdAt;

}