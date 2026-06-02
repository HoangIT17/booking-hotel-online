package com.group.hotel.dto.request;

import com.group.hotel.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingCreateRequest {
    @NotNull(message = "roomId is required!")
    private Long roomId;

    @NotNull(message = "Payment method is required!")
    private PaymentMethod paymentMethod;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @NotNull(message = "checkIn is required!")
    private LocalDateTime checkIn;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @NotNull(message = "checkOut is required!")
    private LocalDateTime checkOut;

    @NotNull(message = "numGuests is required!")
    @Min(value = 1, message = "numGuests must be greater than or equal to 1")
    private Integer numGuests;

    private String voucherCode;
}
