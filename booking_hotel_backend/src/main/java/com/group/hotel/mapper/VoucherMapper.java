package com.group.hotel.mapper;

import com.group.hotel.dto.request.voucher.VoucherCreateRequest;
import com.group.hotel.dto.request.voucher.VoucherUpdateRequest;
import com.group.hotel.dto.response.voucher.VoucherResponse;
import com.group.hotel.entity.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VoucherMapper {
    VoucherResponse toResponse(Voucher voucher);

    Voucher fromCreate(VoucherCreateRequest request);

    void fromUpdate(VoucherUpdateRequest request, @MappingTarget Voucher voucher);
}
