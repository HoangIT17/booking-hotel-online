package com.group.hotel.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeSearchRequest {
    private String typeName;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer maxPeople;
}
