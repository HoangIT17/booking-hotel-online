package com.group.hotel.service;

import com.group.hotel.dto.request.VoucherCreateRequest;
import com.group.hotel.dto.request.VoucherUpdateRequest;
import com.group.hotel.dto.response.VoucherResponse;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAll();

    List<VoucherResponse> getAvailableForCustomer();

    VoucherResponse getDetail(Long id);

    VoucherResponse create(VoucherCreateRequest request);

    VoucherResponse update(Long id, VoucherUpdateRequest request);

    void delete(Long id);
}
