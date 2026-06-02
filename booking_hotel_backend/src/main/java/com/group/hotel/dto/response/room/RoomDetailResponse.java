package com.group.hotel.dto.response.room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomDetailResponse {
    private Long id;
    private String roomType;
    private String roomNumber;
    private Integer floor;
    private BigDecimal price;
    private Double area;
    private Integer maxPeople;
    private String imageUrl;
    private String status;
    private String description;
    private boolean isDeleted;
    private List<RoomFurnitureResponse> furnitures;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
