package com.group.hotel.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeUpdateRequest {
    @NotNull
    private BigDecimal basePrice;
    @NotNull
    private Double area;
    @NotNull
    private Integer maxPeople;
    private String description;
}
