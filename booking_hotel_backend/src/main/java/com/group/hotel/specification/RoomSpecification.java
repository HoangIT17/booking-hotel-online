package com.group.hotel.specification;

import com.group.hotel.entity.Room;
import org.springframework.data.jpa.domain.Specification;

public class RoomSpecification {

    public static Specification<Room> hasRoomNumber(String roomNumber) {
        return (root, query, builder) ->
                builder.like(builder.lower(root.get("roomNumber")),
                        "%" + roomNumber.toLowerCase() + "%");
    }

    public static Specification<Room> hasFloor(Integer floor) {
        return (root, query, builder) ->
                builder.equal(root.get("floor"), floor);
    }

    public static Specification<Room> hasStatus(String status) {
        return (root, query, builder) ->
                builder.equal(root.get("status").as(String.class), status);
    }

    public static Specification<Room> hasRoomTypeId(Long roomTypeId) {
        return (root, query, builder) ->
                builder.equal(root.get("roomType").get("id"), roomTypeId);
    }

    public static Specification<Room> hasIsDeleted(Boolean isDeleted) {
        return (root, query, builder) ->
                builder.equal(root.get("isDeleted"), isDeleted);
    }
}
