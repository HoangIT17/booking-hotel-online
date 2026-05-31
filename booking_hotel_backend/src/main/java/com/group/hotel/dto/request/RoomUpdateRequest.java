package com.group.hotel.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomUpdateRequest {
    @NotBlank
    private String roomType;
    @NotBlank
    private String status;
    private String description;
    private BigDecimal price;
    private Double area;
    private Integer maxPeople;
}
