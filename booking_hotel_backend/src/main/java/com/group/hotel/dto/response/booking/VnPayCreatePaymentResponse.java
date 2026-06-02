package com.group.hotel.dto.response.booking;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class VnPayCreatePaymentResponse {
    private Long bookingId;
    private String transactionRef;
    private BigDecimal amount;
    private String paymentUrl;
}
