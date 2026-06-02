package com.group.hotel.service;

import com.group.hotel.dto.request.voucher.VoucherCreateRequest;
import com.group.hotel.dto.request.voucher.VoucherUpdateRequest;
import com.group.hotel.dto.response.voucher.VoucherResponse;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAll();

    VoucherResponse getDetail(Long id);

    VoucherResponse create(VoucherCreateRequest request);

    VoucherResponse update(Long id, VoucherUpdateRequest request);

    void delete(Long id);
}
