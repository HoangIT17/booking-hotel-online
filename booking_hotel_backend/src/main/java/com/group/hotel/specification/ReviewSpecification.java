package com.group.hotel.specification;

import com.group.hotel.entity.Review;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ReviewSpecification {

    public static Specification<Review> hasReply(Boolean hasReply) {
        return (root, query, builder) -> hasReply
                ? builder.isNotNull(root.get("staffReply"))
                : builder.isNull(root.get("staffReply"));
    }

    public static Specification<Review> hasRating(Integer rating) {
        return (root, query, builder) ->
                builder.equal(root.get("rating").as(Integer.class), rating);
    }

    public static Specification<Review> fromDate(LocalDate fromDate) {
        return (root, query, builder) ->
                builder.greaterThanOrEqualTo(root.get("createdAt").as(java.time.LocalDate.class), fromDate);
    }

    public static Specification<Review> toDate(LocalDate toDate) {
        return (root, query, builder) ->
                builder.lessThanOrEqualTo(root.get("createdAt").as(java.time.LocalDate.class), toDate);
    }

    public static Specification<Review> hasCustomerId(Long customerId) {
        return (root, query, builder) ->
                builder.equal(root.get("customer").get("id"), customerId);
    }

    public static Specification<Review> hasCustomerName(String customerName) {
        return (root, query, builder) -> {
            assert query != null;
            query.distinct(true);
            Join<Object, Object> customer = root.join("customer", JoinType.LEFT);
            Join<Object, Object> profile = customer.join("profile", JoinType.LEFT);
            String pattern = "%" + customerName.toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(profile.get("fullName")), pattern),
                    builder.like(builder.lower(customer.get("username")), pattern)
            );
        };
    }
}
