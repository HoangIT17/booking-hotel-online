package com.group.hotel.service;

import com.group.hotel.dto.request.VnPayCreatePaymentRequest;
import com.group.hotel.dto.response.VnPayCreatePaymentResponse;
import com.group.hotel.dto.response.VnPayReturnResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface VnPayService {
    VnPayCreatePaymentResponse createPaymentUrl(VnPayCreatePaymentRequest request, HttpServletRequest httpRequest);

    VnPayReturnResponse handleReturn(Map<String, String> params);
}
