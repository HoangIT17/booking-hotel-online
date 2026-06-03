package com.group.hotel.exception;

public class ReviewNotFoundException extends RuntimeException {
    public ReviewNotFoundException() {
        super("Không tìm thấy đánh giá");
    }
}
