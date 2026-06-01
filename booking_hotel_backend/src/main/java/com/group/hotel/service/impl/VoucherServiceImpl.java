package com.group.hotel.service.impl;

import com.group.hotel.dto.request.VoucherCreateRequest;
import com.group.hotel.dto.request.VoucherUpdateRequest;
import com.group.hotel.dto.response.VoucherResponse;
import com.group.hotel.entity.Voucher;
import com.group.hotel.exception.VoucherConflictException;
import com.group.hotel.exception.VoucherNotFoundException;
import com.group.hotel.mapper.VoucherMapper;
import com.group.hotel.repository.VoucherRepository;
import com.group.hotel.service.VoucherService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @Override
    public List<VoucherResponse> getAll() {
        return voucherRepository.findAll()
                .stream()
                .map(voucherMapper::toResponse)
                .toList();
    }

    @Override
    public List<VoucherResponse> getAvailableForCustomer() {
        LocalDateTime now = LocalDateTime.now();
        return voucherRepository.findAll()
                .stream()
                .filter(voucher -> voucher.getStartDate() == null || !voucher.getStartDate().isAfter(now))
                .filter(voucher -> voucher.getEndDate() == null || !voucher.getEndDate().isBefore(now))
                .filter(voucher -> voucher.getUsageLimit() == null
                        || voucher.getUsedCount() == null
                        || voucher.getUsedCount() < voucher.getUsageLimit())
                .map(voucherMapper::toResponse)
                .toList();
    }

    @Override
    public VoucherResponse getDetail(Long id) {
        return voucherMapper.toResponse(findVoucher(id));
    }

    @Override
    @Transactional
    public VoucherResponse create(VoucherCreateRequest request) {
        request.setCode(normalizeCode(request.getCode()));
        validateDateRange(request.getStartDate(), request.getEndDate());
        if (voucherRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new VoucherConflictException("Mã voucher đã tồn tại");
        }

        Voucher voucher = voucherMapper.fromCreate(request);
        if (voucher.getUsedCount() == null) {
            voucher.setUsedCount(0);
        }

        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    @Override
    @Transactional
    public VoucherResponse update(Long id, VoucherUpdateRequest request) {
        request.setCode(normalizeCode(request.getCode()));
        validateDateRange(request.getStartDate(), request.getEndDate());
        Voucher voucher = findVoucher(id);

        voucherRepository.findByCodeIgnoreCase(request.getCode())
                .filter(existingVoucher -> !existingVoucher.getId().equals(id))
                .ifPresent(existingVoucher -> {
                    throw new VoucherConflictException("Mã voucher đã tồn tại");
                });

        voucherMapper.fromUpdate(request, voucher);
        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Voucher voucher = findVoucher(id);
        voucherRepository.delete(voucher);
    }

    private Voucher findVoucher(Long id) {
        return voucherRepository.findById(id)
                .orElseThrow(VoucherNotFoundException::new);
    }

    private void validateDateRange(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
            throw new VoucherConflictException("startDate must be before endDate");
        }
    }

    private String normalizeCode(String code) {
        return code == null ? null : code.trim();
    }
}
