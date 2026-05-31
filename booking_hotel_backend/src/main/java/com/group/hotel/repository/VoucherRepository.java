package com.group.hotel.repository;

import com.group.hotel.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    boolean existsByCodeIgnoreCase(String code);

    Optional<Voucher> findByCodeIgnoreCase(String code);
}
