package com.group.hotel.dto.response.room;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomAvailableResponse {
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private String description;
    private BigDecimal price;
    private Integer capacity;
    private String status;
    private Double averageRating;
    private String imageUrl;
}
