package com.group.hotel.dto.response;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import com.group.hotel.enums.RoomTypeName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSearchSystemResponse {
    private Long bookingId;
    private Long roomId;
    private String roomNumber;
    private RoomTypeName roomType;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numNights;
    private Integer numGuests;
    private BigDecimal totalPrice;
    private BookingStatus bookingStatus;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
