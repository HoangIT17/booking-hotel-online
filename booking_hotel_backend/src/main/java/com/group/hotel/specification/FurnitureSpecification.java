package com.group.hotel.specification;

import com.group.hotel.entity.Furniture;
import com.group.hotel.enums.FurnitureType;
import org.springframework.data.jpa.domain.Specification;

public class FurnitureSpecification {
    public static Specification<Furniture> hasFurnitureType(String furnitureType) {
        return (root, query, builder) ->
                builder.equal(root.get("furnitureType"), FurnitureType.valueOf(furnitureType.toUpperCase()));
    }

    public static Specification<Furniture> hasNameContaining(String name) {
        return (root, query, builder) ->
                builder.like(builder.lower(root.get("furnitureName")), "%" + name.toLowerCase() + "%");
    }
}
