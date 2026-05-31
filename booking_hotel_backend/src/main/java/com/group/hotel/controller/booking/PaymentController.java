package com.group.hotel.controller.booking;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.VnPayCreatePaymentRequest;
import com.group.hotel.dto.response.VnPayCreatePaymentResponse;
import com.group.hotel.dto.response.VnPayReturnResponse;
import com.group.hotel.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PaymentController {
    private final VnPayService vnPayService;

    @PostMapping("/api/v1/payments/vnpay/create")
    public ResponseEntity<BaseResponse<VnPayCreatePaymentResponse>> createVnPayPayment(
            @RequestBody @Valid VnPayCreatePaymentRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(BaseResponse.success(vnPayService.createPaymentUrl(request, httpRequest)));
    }

    @GetMapping("/api/v1/payments/vnpay/return")
    public ResponseEntity<BaseResponse<VnPayReturnResponse>> handleVnPayReturn(HttpServletRequest request) {
        Map<String, String[]> parameterMap = request.getParameterMap();
        Map<String, String> params = parameterMap.entrySet().stream()
                .collect(java.util.stream.Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue() != null && entry.getValue().length > 0 ? entry.getValue()[0] : ""
                ));

        VnPayReturnResponse response = vnPayService.handleReturn(params);
        return ResponseEntity.ok(BaseResponse.success(response, response.getMessage()));
    }
}
