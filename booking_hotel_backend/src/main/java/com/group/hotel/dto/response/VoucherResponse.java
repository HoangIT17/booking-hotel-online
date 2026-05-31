package com.group.hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponse {
    private Long id;
    private String code;
    private Integer discountPercent;
    private BigDecimal maxDiscount;
    private BigDecimal minBookingValue;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
