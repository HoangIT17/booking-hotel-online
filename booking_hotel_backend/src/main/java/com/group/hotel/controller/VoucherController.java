package com.group.hotel.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.voucher.VoucherCreateRequest;
import com.group.hotel.dto.request.voucher.VoucherUpdateRequest;
import com.group.hotel.dto.response.voucher.VoucherResponse;
import com.group.hotel.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping("/api/v1/vouchers")
    public ResponseEntity<BaseResponse<List<VoucherResponse>>> getAll() {
        return ResponseEntity.ok(BaseResponse.success(voucherService.getAll()));
    }

    @GetMapping("/api/v1/customer/vouchers/available")
    public ResponseEntity<BaseResponse<List<VoucherResponse>>> getAvailableForCustomer() {
        return ResponseEntity.ok(BaseResponse.success(voucherService.getAvailableForCustomer()));
    }

    @GetMapping("/api/v1/vouchers/{id}")
    public ResponseEntity<BaseResponse<VoucherResponse>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(voucherService.getDetail(id)));
    }

    @PostMapping("/api/v1/vouchers")
    public ResponseEntity<BaseResponse<VoucherResponse>> create(@Valid @RequestBody VoucherCreateRequest request) {
        return ResponseEntity.ok(BaseResponse.success(voucherService.create(request)));
    }

    @PutMapping("/api/v1/vouchers/{id}")
    public ResponseEntity<BaseResponse<VoucherResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody VoucherUpdateRequest request) {
        return ResponseEntity.ok(BaseResponse.success(voucherService.update(id, request)));
    }

    @DeleteMapping("/api/v1/vouchers/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id) {
        voucherService.delete(id);
        return ResponseEntity.ok(BaseResponse.success(null));
    }
}