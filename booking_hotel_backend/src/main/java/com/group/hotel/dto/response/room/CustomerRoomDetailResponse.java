package com.group.hotel.dto.response.room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRoomDetailResponse {
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private BigDecimal price;
    private Integer capacity;
    private String description;
    private String status;
    private String imagesUrl;
    private List<String> features;
    private List<FurnitureItem> furniture;
    private List<ReviewItem> reviews;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FurnitureItem {
        private String name;
        private Integer quantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewItem {
        private Integer rating;
        private String comment;
    }
}
