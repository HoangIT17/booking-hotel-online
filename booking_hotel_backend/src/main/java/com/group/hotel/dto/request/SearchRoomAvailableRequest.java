package com.group.hotel.dto.request;

import com.group.hotel.enums.RoomTypeName;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SearchRoomAvailableRequest {
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkIn;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkOut;

    private RoomTypeName roomType;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    @Min(value = 1, message = "numGuests must be greater than or equal to 1")
    private Integer numGuests;

    private BigDecimal minRating;

    public boolean isValidDateRange() {
        return checkIn == null || checkOut == null || checkIn.isBefore(checkOut);
    }

    public boolean hasDateRange() {
        return checkIn != null && checkOut != null;
    }
}
