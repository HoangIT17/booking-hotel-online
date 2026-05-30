package com.group.hotel.controller.booking;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.VoucherCreateRequest;
import com.group.hotel.dto.request.VoucherUpdateRequest;
import com.group.hotel.dto.response.VoucherResponse;
import com.group.hotel.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping("/api/v1/vouchers")
    public ResponseEntity<BaseResponse<List<VoucherResponse>>> getAll() {
        return ResponseEntity.ok(BaseResponse.success(voucherService.getAll()));
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
