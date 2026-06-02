package com.group.hotel.repository;

import com.group.hotel.entity.HousekeepingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HousekeepingLogRepository extends JpaRepository<HousekeepingLog, Long> {

    // Bạn có thể thêm các hàm tùy chỉnh tại đây nếu cần
    // Ví dụ: Lấy tất cả các yêu cầu đang ở trạng thái PENDING
    List<HousekeepingLog> findByStatus(com.group.hotel.enums.HousekeepingStatus status);

}