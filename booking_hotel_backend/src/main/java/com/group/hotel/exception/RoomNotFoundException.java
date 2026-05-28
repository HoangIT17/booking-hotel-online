package com.group.hotel.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException() {
        super("Không tìm thấy phòng");
    }
}
