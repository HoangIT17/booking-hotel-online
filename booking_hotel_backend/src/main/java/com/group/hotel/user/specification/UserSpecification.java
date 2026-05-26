package com.group.hotel.user.specification;

import com.group.hotel.user.entity.User;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class UserSpecification {

    public static Specification<User> filterUsers(String keyword, String roleName, Boolean isActive) {
        return (root, query, criteriaBuilder) -> {
            Specification<User> spec = Specification.where(null);

            // 1. Tìm kiếm tổng hợp (Keyword)
            if (StringUtils.hasText(keyword)) {
                String likeKeyword = "%" + keyword.toLowerCase() + "%";
                spec = spec.and((r, q, cb) -> cb.or(
                        cb.like(cb.lower(r.get("username")), likeKeyword),
                        cb.like(cb.lower(r.get("email")), likeKeyword),
                        // Join bảng Profile để tìm theo FullName
                        cb.like(cb.lower(r.join("profile", JoinType.LEFT).get("fullName")), likeKeyword)
                ));
            }

            // 2. Lọc theo Role
            if (StringUtils.hasText(roleName)) {
                spec = spec.and((r, q, cb) ->
                        cb.equal(r.join("role", JoinType.INNER).get("roleName"), roleName.toUpperCase())
                );
            }

            // 3. Lọc theo trạng thái Hoạt động
            if (isActive != null) {
                spec = spec.and((r, q, cb) -> cb.equal(r.get("isActive"), isActive));
            }

            return spec.toPredicate(root, query, criteriaBuilder);
        };
    }
}