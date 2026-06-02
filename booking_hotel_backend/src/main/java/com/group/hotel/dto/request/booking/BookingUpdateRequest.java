package com.group.hotel.dto.request.booking;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingUpdateRequest {
    @NotNull(message = "bookingId is required!")
    private Long bookingId;

    @FutureOrPresent
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkIn;

    @Future
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkOut;

    private String fullName;

    private String email;

    private String phone;

    private PaymentMethod paymentMethod;

    private BookingStatus bookingStatus;
}
