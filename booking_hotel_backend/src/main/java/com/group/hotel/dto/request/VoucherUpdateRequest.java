package com.group.hotel.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherUpdateRequest {
    private String code;

    @Min(value = 1, message = "discountPercent must be greater than or equal to 1")
    @Max(value = 100, message = "discountPercent must be less than or equal to 100")
    private Integer discountPercent;

    @DecimalMin(value = "0.0", inclusive = true, message = "maxDiscount must be greater than or equal to 0")
    private BigDecimal maxDiscount;

    @DecimalMin(value = "0.0", inclusive = true, message = "minBookingValue must be greater than or equal to 0")
    private BigDecimal minBookingValue;

    @Min(value = 1, message = "usageLimit must be greater than or equal to 1")
    private Integer usageLimit;

    @Min(value = 0, message = "usedCount must be greater than or equal to 0")
    private Integer usedCount;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
