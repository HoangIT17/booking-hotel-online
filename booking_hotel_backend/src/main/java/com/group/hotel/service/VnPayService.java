package com.group.hotel.service;

import com.group.hotel.dto.request.booking.VnPayCreatePaymentRequest;
import com.group.hotel.dto.response.booking.VnPayCreatePaymentResponse;
import com.group.hotel.dto.response.booking.VnPayReturnResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface VnPayService {
    VnPayCreatePaymentResponse createPaymentUrl(VnPayCreatePaymentRequest request, HttpServletRequest httpRequest);

    VnPayReturnResponse handleReturn(Map<String, String> params);
}
