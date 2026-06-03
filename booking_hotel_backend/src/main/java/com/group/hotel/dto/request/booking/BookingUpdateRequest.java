package com.group.hotel.dto.request.booking;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingUpdateRequest {
    @NotNull(message = "bookingId is required!")
    private Long bookingId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime checkIn;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime checkOut;

    private PaymentMethod paymentMethod;

    private BookingStatus bookingStatus;
}
