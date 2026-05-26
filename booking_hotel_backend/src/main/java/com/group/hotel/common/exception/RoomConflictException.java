package com.group.hotel.common.exception;

public class RoomConflictException extends RuntimeException{
    public RoomConflictException(String message){
        super(message);
    }
}
