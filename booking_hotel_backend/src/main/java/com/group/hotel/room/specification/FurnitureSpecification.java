package com.group.hotel.room.specification;

import com.group.hotel.room.entity.Furniture;
import com.group.hotel.enums.FurnitureType;
import org.springframework.data.jpa.domain.Specification;

public class FurnitureSpecification {
    public static Specification<Furniture> hasFurnitureType (String furnitureType) {
        return (root, query, builder) ->
                builder.equal(root.get("furnitureType"), FurnitureType.valueOf(furnitureType.toUpperCase()));
    }
}
