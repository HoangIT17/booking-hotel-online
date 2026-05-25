package com.group.hotel.repository;

import com.group.hotel.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    // Hàm hiện tại của bạn (giữ nguyên nếu có chỗ khác đang dùng)
    Optional<Incident> findTopByRoom_IdOrderByCreatedAtDesc(Long roomId);

    // [BỔ SUNG THÊM]: Hàm lấy TOÀN BỘ danh sách sự cố của phòng, xếp mới nhất lên đầu
    List<Incident> findByRoom_IdOrderByCreatedAtDesc(Long roomId);
}