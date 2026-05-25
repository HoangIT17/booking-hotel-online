package com.group.hotel.specification;

import com.group.hotel.entity.RoomType;
import com.group.hotel.enums.RoomTypeName;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class RoomTypeSpecification {

    public static Specification<RoomType> hasTypeName(String typeName){
        return (root, query, builder) ->
                builder.equal(root.get("typeName"), RoomTypeName.valueOf(typeName.toUpperCase()));
    }

    public static Specification<RoomType> hasMinPrice(BigDecimal minPrice) {
        return (root, query, builder) ->
                builder.greaterThanOrEqualTo(root.get("basePrice"), minPrice);
    }

    public static Specification<RoomType> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, builder) ->
                builder.lessThanOrEqualTo(root.get("basePrice"), maxPrice);
    }

    public static Specification<RoomType> hasMinMaxPeople(Integer maxPeople){
        return (root, query, builder) ->
                builder.greaterThanOrEqualTo(root.get("maxPeople"), maxPeople);
    }
}
