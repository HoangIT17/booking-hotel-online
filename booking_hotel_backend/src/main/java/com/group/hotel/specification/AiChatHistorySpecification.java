package com.group.hotel.specification;

import com.group.hotel.entity.AiChatHistory;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

public class AiChatHistorySpecification {

    public static Specification<AiChatHistory> filterHistory(String search, LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            // Lọc theo search (Tên khách hàng hoặc nội dung câu hỏi)
            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.toLowerCase() + "%";
                Join<Object, Object> customerJoin = root.join("customer", JoinType.LEFT);

                predicates = cb.and(predicates, cb.or(
                        cb.like(cb.lower(customerJoin.get("fullName")), pattern),
                        cb.like(cb.lower(customerJoin.get("username")), pattern),
                        cb.like(cb.lower(root.get("question")), pattern)
                ));
            }

            // Lọc theo ngày bắt đầu (Lớn hơn hoặc bằng 00:00:00 của ngày đó)
            if (startDate != null) {
                predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay()));
            }

            // Lọc theo ngày kết thúc (Nhỏ hơn hoặc bằng 23:59:59 của ngày đó)
            if (endDate != null) {
                predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("createdAt"), endDate.atTime(23, 59, 59)));
            }

            return predicates;
        };
    }
}