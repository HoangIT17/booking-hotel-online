package com.group.hotel.exception;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException() {
        super("Không tìm thấy booking");
    }
}
