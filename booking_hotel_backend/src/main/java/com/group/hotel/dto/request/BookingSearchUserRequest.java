package com.group.hotel.dto.request;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSearchUserRequest {
    private Long bookingId;
    private String roomNumber;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime checkIn;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime checkOut;

    private BookingStatus bookingStatus;
    private PaymentMethod paymentMethod;
}
