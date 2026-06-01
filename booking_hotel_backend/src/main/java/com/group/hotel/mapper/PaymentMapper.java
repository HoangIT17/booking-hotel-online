package com.group.hotel.mapper;

import com.group.hotel.dto.response.VnPayCreatePaymentResponse;
import com.group.hotel.dto.response.VnPayReturnResponse;
import com.group.hotel.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "amount", source = "booking.totalPrice")
    @Mapping(target = "transactionRef", source = "transactionRef")
    @Mapping(target = "paymentUrl", source = "paymentUrl")
    VnPayCreatePaymentResponse toVnPayCreatePaymentResponse(
            Booking booking,
            String transactionRef,
            String paymentUrl
    );

    @Mapping(target = "validSignature", source = "validSignature")
    @Mapping(target = "success", source = "success")
    @Mapping(target = "bookingId", source = "bookingId")
    @Mapping(target = "responseCode", expression = "java(params.get(\"vnp_ResponseCode\"))")
    @Mapping(target = "transactionStatus", expression = "java(params.get(\"vnp_TransactionStatus\"))")
    @Mapping(target = "transactionNo", expression = "java(params.get(\"vnp_TransactionNo\"))")
    @Mapping(target = "bankCode", expression = "java(params.get(\"vnp_BankCode\"))")
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "payDate", source = "payDate")
    @Mapping(target = "message", source = "message")
    VnPayReturnResponse toVnPayReturnResponse(
            boolean validSignature,
            boolean success,
            Long bookingId,
            Map<String, String> params,
            BigDecimal amount,
            LocalDateTime payDate,
            String message
    );
}
