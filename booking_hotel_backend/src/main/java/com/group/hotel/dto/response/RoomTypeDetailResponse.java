package com.group.hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeDetailResponse {
    private Long id;
    private String typeName;
    private BigDecimal basePrice;
    private Double area;
    private Integer maxPeople;
    private String description;
    private List<RoomImageResponse> images;
    private List<FurnitureInRoomTypeResponse> furniture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
