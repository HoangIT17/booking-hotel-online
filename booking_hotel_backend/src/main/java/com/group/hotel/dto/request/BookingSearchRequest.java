package com.group.hotel.dto.request;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import com.group.hotel.enums.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSearchRequest {
    private Long bookingId;
    private String customerName;
    private String roomNumber;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private RoomStatus roomStatus;
    private BookingStatus bookingStatus;
    private PaymentMethod paymentMethod;

    public boolean hasDateRange() {
        return checkIn != null && checkOut != null;
    }

    public boolean isValidDateRange() {
        return checkIn == null || checkOut == null || checkIn.isBefore(checkOut);
    }
}
