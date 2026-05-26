package com.group.hotel.common.exception;

public class FurnitureNotFoundException extends RuntimeException {
    public FurnitureNotFoundException(){
        super("Nội thất không tồn tại");
    }
}
