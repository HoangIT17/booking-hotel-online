package com.group.hotel.specification;

import com.group.hotel.entity.AiKnowledgeBase;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class AiKnowledgeSpecification {
    public static Specification<AiKnowledgeBase> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) return null;

            // Tìm kiếm không phân biệt hoa thường trong cả câu hỏi và câu trả lời
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("questionPattern")), pattern),
                    cb.like(cb.lower(root.get("answerContent")), pattern)
            );
        };
    }
}