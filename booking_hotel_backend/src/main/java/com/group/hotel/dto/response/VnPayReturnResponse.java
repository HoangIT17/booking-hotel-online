package com.group.hotel.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class VnPayReturnResponse {
    private boolean validSignature;
    private boolean success;
    private Long bookingId;
    private String responseCode;
    private String transactionStatus;
    private String transactionNo;
    private String bankCode;
    private BigDecimal amount;
    private LocalDateTime payDate;
    private String message;
}
