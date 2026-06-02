package com.group.hotel.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewCreateRequest {
    @NotNull(message = "bookingId is required!")
    private Long bookingId;

    @NotNull(message = "rating is required!")
    @Min(value = 1, message = "rating must be greater than or equal to 1")
    @Max(value = 5, message = "rating must be less than or equal to 5")
    private Integer rating;

    private String comment;
}
