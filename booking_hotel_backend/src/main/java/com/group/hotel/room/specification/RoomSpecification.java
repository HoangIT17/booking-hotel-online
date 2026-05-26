package com.group.hotel.room.specification;

import com.group.hotel.booking.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.booking.entity.BookingDetail;
import com.group.hotel.booking.entity.Review;
import com.group.hotel.room.entity.Room;
import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.RoomStatus;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

public class RoomSpecification {
    private static final List<BookingStatus> BLOCKING_BOOKING_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN
    );

    public static Specification<Room> searchAvailableRooms(SearchRoomAvailableRequest request) {
        return (root, query, builder) -> {
            Specification<Room> spec = (roomRoot, roomQuery, criteriaBuilder) -> criteriaBuilder.conjunction();

            spec = spec.and(isReady());
            spec = spec.and(hasIsDeleted(false));

            if (request.getRoomType() != null) {
                spec = spec.and((roomRoot, roomQuery, criteriaBuilder) ->
                        criteriaBuilder.equal(roomRoot.join("roomType", JoinType.INNER).get("typeName"), request.getRoomType()));
            }
            if (request.getMinPrice() != null) {
                spec = spec.and(hasMinPrice(request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                spec = spec.and(hasMaxPrice(request.getMaxPrice()));
            }
            if (request.getNumGuests() != null) {
                spec = spec.and(hasCapacityFor(request.getNumGuests()));
            }
            if (request.getMinRating() != null) {
                spec = spec.and(hasMinRating(request.getMinRating()));
            }
            if (request.hasDateRange()) {
                spec = spec.and(hasNoOverlappingBooking(request));
            }

            return spec.toPredicate(root, query, builder);
        };
    }

    private static Specification<Room> isReady() {
        return (root, query, builder) ->
                builder.equal(root.get("status"), RoomStatus.READY);
    }

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

    private static Specification<Room> hasMinPrice(BigDecimal minPrice) {
        return (root, query, builder) ->
                builder.greaterThanOrEqualTo(root.join("roomType", JoinType.INNER).get("basePrice"), minPrice);
    }

    private static Specification<Room> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, builder) ->
                builder.lessThanOrEqualTo(root.join("roomType", JoinType.INNER).get("basePrice"), maxPrice);
    }

    private static Specification<Room> hasCapacityFor(Integer numGuests) {
        return (root, query, builder) ->
                builder.greaterThanOrEqualTo(root.join("roomType", JoinType.INNER).get("maxPeople"), numGuests);
    }

    private static Specification<Room> hasMinRating(BigDecimal minRating) {
        return (root, query, builder) -> {
            Subquery<Double> subquery = query.subquery(Double.class);
            var review = subquery.from(Review.class);
            var bookingDetail = subquery.from(BookingDetail.class);

            subquery.select(builder.avg(review.get("rating")))
                    .where(
                            builder.equal(bookingDetail.get("booking"), review.get("booking")),
                            builder.equal(bookingDetail.get("room"), root)
                    );

            return builder.greaterThanOrEqualTo(
                    builder.coalesce(subquery, 0D),
                    minRating.doubleValue()
            );
        };
    }

    private static Specification<Room> hasNoOverlappingBooking(SearchRoomAvailableRequest request) {
        return (root, query, builder) -> {
            Subquery<Long> subquery = query.subquery(Long.class);
            var bookingDetail = subquery.from(BookingDetail.class);
            var booking = bookingDetail.join("booking", JoinType.INNER);

            subquery.select(bookingDetail.get("id"))
                    .where(
                            builder.equal(bookingDetail.get("room"), root),
                            booking.get("status").in(BLOCKING_BOOKING_STATUSES),
                            builder.lessThan(booking.get("checkInDate"), request.getCheckOut()),
                            builder.greaterThan(booking.get("checkOutDate"), request.getCheckIn())
                    );

            return builder.not(builder.exists(subquery));
        };
    }
}
