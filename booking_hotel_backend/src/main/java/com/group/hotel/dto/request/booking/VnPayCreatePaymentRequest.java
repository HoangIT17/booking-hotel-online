package com.group.hotel.dto.request.booking;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VnPayCreatePaymentRequest {
    @NotNull(message = "bookingId is required")
    private Long bookingId;

    private String orderInfo;
    private String locale;
}
