package com.group.hotel.specification;

import com.group.hotel.entity.Incident;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
import java.time.LocalTime;

public class IncidentSpecification {

    public static Specification<Incident> hasStatus(String status) {
        return (root, query, cb) -> (status == null || status.isEmpty()) ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    // ✅ Đã sửa từ "type" thành "incidentType" ứng với biến trong Entity
    public static Specification<Incident> hasType(String type) {
        return (root, query, cb) -> (type == null || type.isEmpty()) ? cb.conjunction() : cb.equal(root.get("incidentType"), type);
    }

    // ✅ Tránh lỗi: Vì Entity không có priority nên trả về cb.conjunction() để bỏ qua lọc trường này
    public static Specification<Incident> hasPriority(String priority) {
        return (root, query, cb) -> cb.conjunction();
    }

    public static Specification<Incident> hasRoomId(Long roomId) {
        return (root, query, cb) -> roomId == null ? cb.conjunction() : cb.equal(root.get("room").get("id"), roomId);
    }

    public static Specification<Incident> hasStaffId(Long staffId) {
        return (root, query, cb) -> staffId == null ? cb.conjunction() : cb.equal(root.get("staff").get("id"), staffId);
    }

    public static Specification<Incident> isFromDate(LocalDate fromDate) {
        return (root, query, cb) -> fromDate == null ? cb.conjunction() :
                cb.greaterThanOrEqualTo(root.get("createdAt"), fromDate.atStartOfDay());
    }

    public static Specification<Incident> isToDate(LocalDate toDate) {
        return (root, query, cb) -> toDate == null ? cb.conjunction() :
                cb.lessThanOrEqualTo(root.get("createdAt"), toDate.atTime(LocalTime.MAX));
    }
}