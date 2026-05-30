package com.group.hotel.dto.response;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import com.group.hotel.enums.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSearchManagerResponse {
    private Long bookingId;
    private String username;
    private String fullName;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalPrice;
    private RoomStatus roomStatus;
    private BookingStatus bookingStatus;
    private PaymentMethod paymentMethod;
}
