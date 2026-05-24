package com.group.hotel.exception;

public class RoomImageNotFoundException extends RuntimeException {
    public RoomImageNotFoundException() {
        super("Không tìm thấy ảnh!");
    }
}
