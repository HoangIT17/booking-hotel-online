package com.group.hotel.specification;

import com.group.hotel.entity.AiChatHistory;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AiChatHistorySpecification {

    public static Specification<AiChatHistory> filterHistory(String search, LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Xử lý tìm kiếm (Search)
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.toLowerCase().trim() + "%";

                // Tìm trong nội dung câu hỏi
                Predicate questionMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("question")), searchPattern);

                // Tìm trong nội dung AI trả lời
                Predicate responseMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("aiResponse")), searchPattern);

                // 🌟 CHUẨN NGHIỆP VỤ: Tìm theo Tên Khách Hàng (Nối bảng AiChatHistory -> User -> Profile)
                Join<Object, Object> customerJoin = root.join("customer", JoinType.LEFT);
                Join<Object, Object> profileJoin = customerJoin.join("profile", JoinType.LEFT);

                Predicate fullNameMatch = criteriaBuilder.like(criteriaBuilder.lower(profileJoin.get("fullName")), searchPattern);

                // Gom 3 điều kiện lại bằng toán tử OR (Khớp Câu hỏi, Câu trả lời, HOẶC Tên khách hàng)
                predicates.add(criteriaBuilder.or(questionMatch, responseMatch, fullNameMatch));
            }

            // 2. Xử lý bộ lọc Từ ngày (StartDate)
            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay()));
            }

            // 3. Xử lý bộ lọc Đến ngày (EndDate)
            if (endDate != null) {
                // Lấy đến 23:59:59 của ngày kết thúc
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate.atTime(23, 59, 59)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}