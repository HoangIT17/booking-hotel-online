package com.group.hotel.exception;

public class FurnitureNotFoundException extends RuntimeException {
    public FurnitureNotFoundException(){
        super("Nội thất không tồn tại");
    }
}
