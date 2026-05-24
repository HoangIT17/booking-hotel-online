package com.group.hotel.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeUpdateRequest {
    private BigDecimal basePrice;
    private Double area;
    private Integer maxPeople;
    private String description;
}
