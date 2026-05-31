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
public class VoucherCreateRequest {
    @NotBlank(message = "code is required")
    private String code;

    @NotNull(message = "discountPercent is required")
    @Min(value = 1, message = "discountPercent must be greater than or equal to 1")
    @Max(value = 100, message = "discountPercent must be less than or equal to 100")
    private Integer discountPercent;

    @NotNull(message = "maxDiscount is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "maxDiscount must be greater than or equal to 0")
    private BigDecimal maxDiscount;

    @NotNull(message = "minBookingValue is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "minBookingValue must be greater than or equal to 0")
    private BigDecimal minBookingValue;

    @NotNull(message = "usageLimit is required")
    @Min(value = 1, message = "usageLimit must be greater than or equal to 1")
    private Integer usageLimit;

    @Min(value = 0, message = "usedCount must be greater than or equal to 0")
    private Integer usedCount;

    @NotNull(message = "startDate is required")
    private LocalDateTime startDate;

    @NotNull(message = "endDate is required")
    private LocalDateTime endDate;
}
