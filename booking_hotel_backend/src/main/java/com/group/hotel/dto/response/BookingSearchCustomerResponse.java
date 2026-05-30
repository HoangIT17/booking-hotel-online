package com.group.hotel.dto.response;

import com.group.hotel.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSearchCustomerResponse {
    private Long id;
    private String roomNumber;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDateTime checkInDateTime;
    private LocalDateTime checkOutDateTime;
    private BookingStatus bookingStatus;
}
