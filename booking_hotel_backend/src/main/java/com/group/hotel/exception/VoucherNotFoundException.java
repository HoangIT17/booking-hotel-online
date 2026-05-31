package com.group.hotel.exception;

public class VoucherNotFoundException extends RuntimeException {
    public VoucherNotFoundException() {
        super("Không tìm thấy voucher");
    }
}
