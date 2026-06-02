package com.group.hotel.dto.request.booking;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSearchUserRequest {
    private Long bookingId;
    private String roomNumber;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkIn;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkOut;

    private BookingStatus bookingStatus;
    private PaymentMethod paymentMethod;

    public boolean hasDateRange() {
        return checkIn != null && checkOut != null;
    }

    public boolean isValidDateRange() {
        return checkIn == null || checkOut == null || checkIn.isBefore(checkOut);
    }
}
