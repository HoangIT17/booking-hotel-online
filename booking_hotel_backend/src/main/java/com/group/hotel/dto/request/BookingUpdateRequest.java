package com.group.hotel.dto.request;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingUpdateRequest {
    @NotNull(message = "bookingId is required!")
    private Long bookingId;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private String fullName;

    private String email;

    private String phone;

    private PaymentMethod paymentMethod;

    private BookingStatus bookingStatus;

    public boolean hasDateRange() {
        return checkIn != null && checkOut != null;
    }

    public boolean isValidDateRange() {
        return checkIn == null || checkOut == null || checkIn.isBefore(checkOut);
    }
}
