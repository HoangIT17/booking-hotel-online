package com.group.hotel.dto.response.booking;

import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import com.group.hotel.enums.RoomTypeName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingSearchCustomerResponse {
    private Long bookingId;
    private Long roomId;
    private String roomNumber;
    private RoomTypeName roomType;
    private String fullName;
    private String email;
    private String phone;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private Integer numNights;
    private Integer numGuests;
    private BigDecimal totalPrice;
    private BookingStatus bookingStatus;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
