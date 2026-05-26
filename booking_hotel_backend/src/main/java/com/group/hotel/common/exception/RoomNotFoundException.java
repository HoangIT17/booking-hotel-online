package com.group.hotel.common.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException() {
        super("Không tìm thấy phòng");
    }
}
