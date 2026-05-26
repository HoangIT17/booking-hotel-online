package com.group.hotel.common.exception;

public class RoomImageNotFoundException extends RuntimeException {
    public RoomImageNotFoundException() {
        super("Không tìm thấy ảnh!");
    }
}
