package com.group.hotel.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class) // Tự động chuyển camelCase thành snake_case (total_items, total_pages)
public class IncidentListResponse {
    private List<IncidentResponse> items;
    private int page;
    private int size;
    private long totalItems;
    private int totalPages;
}