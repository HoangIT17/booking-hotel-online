package com.group.hotel.service.impl;

import com.group.hotel.config.VnPayProperties;
import com.group.hotel.dto.request.VnPayCreatePaymentRequest;
import com.group.hotel.dto.response.VnPayCreatePaymentResponse;
import com.group.hotel.dto.response.VnPayReturnResponse;
import com.group.hotel.entity.Booking;
import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import com.group.hotel.exception.BookingNotFoundException;
import com.group.hotel.exception.PaymentConflictException;
import com.group.hotel.mapper.PaymentMapper;
import com.group.hotel.repository.BookingRepository;
import com.group.hotel.security.UserPrincipal;
import com.group.hotel.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Transactional
@RequiredArgsConstructor
public class VnPayServiceImpl implements VnPayService {
    private static final DateTimeFormatter VNPAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final ZoneId VNPAY_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final String SUCCESS_CODE = "00";

    private final VnPayProperties properties;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public VnPayCreatePaymentResponse createPaymentUrl(VnPayCreatePaymentRequest request, HttpServletRequest httpRequest) {
        validateConfig();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(BookingNotFoundException::new);
        validateCurrentUserOwnsBooking(booking);
        if (booking.getTotalPrice() == null || booking.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentConflictException("Booking total price is invalid");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REFUNDED) {
            throw new PaymentConflictException("Cannot pay for this booking status");
        }

        String transactionRef = buildTransactionRef(booking.getId());
        String orderInfo = resolveOrderInfo(request, booking);
        LocalDateTime now = LocalDateTime.now(VNPAY_ZONE);

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", properties.getVersion());
        vnpParams.put("vnp_Command", properties.getCommand());
        vnpParams.put("vnp_TmnCode", properties.getTmnCode());
        vnpParams.put("vnp_Amount", toVnPayAmount(booking.getTotalPrice()));
        vnpParams.put("vnp_CurrCode", properties.getCurrCode());
        vnpParams.put("vnp_TxnRef", transactionRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", properties.getOrderType());
        vnpParams.put("vnp_Locale", resolveLocale(request));
        vnpParams.put("vnp_ReturnUrl", properties.getReturnUrl());
        vnpParams.put("vnp_IpAddr", getIpAddress(httpRequest));
        vnpParams.put("vnp_CreateDate", now.format(VNPAY_DATE_FORMATTER));
        vnpParams.put("vnp_ExpireDate", now.plusMinutes(properties.getExpireMinutes()).format(VNPAY_DATE_FORMATTER));
        if (request.getBankCode() != null && !request.getBankCode().isBlank()) {
            vnpParams.put("vnp_BankCode", request.getBankCode().trim());
        }

        String queryUrl = buildQuery(vnpParams);
        String secureHash = hmacSHA512(properties.getHashSecret(), buildHashData(vnpParams));
        String paymentUrl = properties.getPayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;

        return paymentMapper.toVnPayCreatePaymentResponse(booking, transactionRef, paymentUrl);
    }

    @Override
    public VnPayReturnResponse handleReturn(Map<String, String> params) {
        validateConfig();

        String secureHash = params.get("vnp_SecureHash");
        Map<String, String> fields = new HashMap<>(params);
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        boolean validSignature = secureHash != null
                && secureHash.equalsIgnoreCase(hmacSHA512(properties.getHashSecret(), buildHashData(fields)));
        Long bookingId = parseBookingId(params.get("vnp_TxnRef"));
        boolean paymentSuccess = validSignature
                && SUCCESS_CODE.equals(params.get("vnp_ResponseCode"))
                && SUCCESS_CODE.equals(params.get("vnp_TransactionStatus"));

        if (validSignature && bookingId != null) {
            if (paymentSuccess) {
                markBookingPaid(bookingId);
            } else {
                markBookingCancelled(bookingId);
            }
        }

        return paymentMapper.toVnPayReturnResponse(
                validSignature,
                paymentSuccess,
                bookingId,
                params,
                parseAmount(params.get("vnp_Amount")),
                parsePayDate(params.get("vnp_PayDate")),
                resolveReturnMessage(validSignature, paymentSuccess)
        );
    }

    private void markBookingPaid(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(BookingNotFoundException::new);
        booking.setPaymentMethod(PaymentMethod.WALLET);
        booking.setPaymentDate(LocalDateTime.now());
        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
        bookingRepository.save(booking);
    }

    private void markBookingCancelled(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(BookingNotFoundException::new);
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private void validateCurrentUserOwnsBooking(Booking booking) {
        Long currentUserId = getCurrentUserId();
        if (booking.getCustomer() == null
                || booking.getCustomer().getId() == null
                || !booking.getCustomer().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only pay for your own booking");
        }
    }

    private Long getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication is required");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getId();
        }

        throw new AccessDeniedException("Authentication is required");
    }

    private String buildTransactionRef(Long bookingId) {
        return bookingId + "-" + ThreadLocalRandom.current().nextInt(100000, 1000000);
    }

    private Long parseBookingId(String transactionRef) {
        if (transactionRef == null || transactionRef.isBlank()) {
            return null;
        }
        String bookingId = transactionRef.split("-", 2)[0];
        try {
            return Long.parseLong(bookingId);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String resolveOrderInfo(VnPayCreatePaymentRequest request, Booking booking) {
        if (request.getOrderInfo() != null && !request.getOrderInfo().isBlank()) {
            return request.getOrderInfo().trim();
        }
        return "Thanh toan booking " + booking.getId();
    }

    private String resolveLocale(VnPayCreatePaymentRequest request) {
        if (request.getLocale() != null && !request.getLocale().isBlank()) {
            return request.getLocale().trim();
        }
        return properties.getLocale();
    }

    private String toVnPayAmount(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .toPlainString();
    }

    private BigDecimal parseAmount(String amount) {
        if (amount == null || amount.isBlank()) {
            return null;
        }
        try {
            return new BigDecimal(amount).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private LocalDateTime parsePayDate(String payDate) {
        if (payDate == null || payDate.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(payDate, VNPAY_DATE_FORMATTER);
        } catch (RuntimeException ex) {
            return null;
        }
    }

    private String resolveReturnMessage(boolean validSignature, boolean paymentSuccess) {
        if (!validSignature) {
            return "Invalid VNPay signature";
        }
        return paymentSuccess ? "Payment successful" : "Payment failed";
    }

    private String buildQuery(Map<String, String> params) {
        return buildParamString(params, true);
    }

    private String buildHashData(Map<String, String> params) {
        return buildParamString(params, false);
    }

    private String buildParamString(Map<String, String> params, boolean encodeKey) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder builder = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue == null || fieldValue.isBlank()) {
                continue;
            }
            if (!builder.isEmpty()) {
                builder.append('&');
            }
            if (encodeKey) {
                builder.append(encode(fieldName));
            } else {
                builder.append(fieldName);
            }
            builder.append('=').append(encode(fieldValue));
        }
        return builder.toString();
    }

    private String encode(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.US_ASCII.toString());
        } catch (UnsupportedEncodingException ex) {
            throw new PaymentConflictException("Cannot encode VNPay parameter");
        }
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(result.length * 2);
            for (byte b : result) {
                builder.append(String.format("%02x", b & 0xff));
            }
            return builder.toString();
        } catch (Exception ex) {
            throw new PaymentConflictException("Cannot create VNPay secure hash");
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-FORWARDED-FOR");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void validateConfig() {
        if (isBlank(properties.getPayUrl())
                || isBlank(properties.getReturnUrl())
                || isBlank(properties.getTmnCode())
                || isBlank(properties.getHashSecret())) {
            throw new PaymentConflictException("VNPay configuration is missing");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
