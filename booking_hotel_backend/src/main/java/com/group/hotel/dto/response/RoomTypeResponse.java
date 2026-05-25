package com.group.hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeResponse {
    private Long id;
    private String typeName;
    private BigDecimal basePrice;
    private Double area;
    private Integer maxPeople;
    private String description;
    private String thumbnail;
}
