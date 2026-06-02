package com.group.hotel.specification;

import com.group.hotel.dto.request.booking.BookingSearchSystemRequest;
import com.group.hotel.dto.request.booking.BookingSearchUserRequest;
import com.group.hotel.entity.Booking;
import com.group.hotel.entity.BookingDetail;
import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.PaymentMethod;
import com.group.hotel.enums.RoomStatus;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.Collection;

public class BookingSpecification {
    public static Specification<Booking> searchBookingRequest(BookingSearchSystemRequest request) {
        return (root, query, builder) -> {
            Specification<Booking> spec = (bookingRoot, bookingQuery, criteriaBuilder) ->
                    criteriaBuilder.conjunction();

            if (request == null) {
                return spec.toPredicate(root, query, builder);
            }

            if (request.getBookingId() != null) {
                spec = spec.and(hasBookingId(request.getBookingId()));
            }
            if (request.getCustomerName() != null && !request.getCustomerName().isBlank()) {
                spec = spec.and(hasCustomerName(request.getCustomerName()));
            }
            if (request.getRoomNumber() != null && !request.getRoomNumber().isBlank()) {
                spec = spec.and(hasRoomNumber(request.getRoomNumber()));
            }
            if (hasDateRange(request.getCheckIn(), request.getCheckOut())) {
                spec = spec.and(overlapsDateRange(request.getCheckIn(), request.getCheckOut()));
            }
            if (request.getRoomStatus() != null) {
                spec = spec.and(hasRoomStatus(request.getRoomStatus()));
            }
            if (request.getBookingStatus() != null) {
                spec = spec.and(hasBookingStatus(request.getBookingStatus()));
            }
            if (request.getPaymentMethod() != null) {
                spec = spec.and(hasPaymentMethod(request.getPaymentMethod()));
            }

            return spec.toPredicate(root, query, builder);
        };
    }

    public static Specification<Booking> searchCustomerBookingRequest(BookingSearchUserRequest request, Long customerId) {
        return (root, query, builder) -> {
            Specification<Booking> spec = hasCustomerId(customerId);

            if (request == null) {
                return spec.toPredicate(root, query, builder);
            }

            if (request.getBookingId() != null) {
                spec = spec.and(hasBookingId(request.getBookingId()));
            }
            if (request.getRoomNumber() != null && !request.getRoomNumber().isBlank()) {
                spec = spec.and(hasRoomNumber(request.getRoomNumber()));
            }
            if (hasDateRange(request.getCheckIn(), request.getCheckOut())) {
                spec = spec.and(overlapsDateRange(request.getCheckIn(), request.getCheckOut()));
            } else {
                if (request.getCheckIn() != null) {
                    spec = spec.and(hasCheckInFrom(request.getCheckIn()));
                }
                if (request.getCheckOut() != null) {
                    spec = spec.and(hasCheckOutTo(request.getCheckOut()));
                }
            }
            if (request.getBookingStatus() != null) {
                spec = spec.and(hasBookingStatus(request.getBookingStatus()));
            }
            if (request.getPaymentMethod() != null) {
                spec = spec.and(hasPaymentMethod(request.getPaymentMethod()));
            }

            return spec.toPredicate(root, query, builder);
        };
    }

    public static Specification<Booking> hasBookingId(Long id) {
        return (root, query, builder) ->
                builder.equal(root.get("id"), id);
    }

    public static Specification<Booking> hasCustomerId(Long customerId) {
        return (root, query, builder) ->
                builder.equal(root.get("customer").get("id"), customerId);
    }

    private static boolean hasDateRange(LocalDateTime checkIn, LocalDateTime checkOut) {
        return checkIn != null && checkOut != null;
    }

    public static Specification<Booking> hasCustomerName(String customerName) {
        return (root, query, builder) -> {
            var customer = root.join("customer", JoinType.LEFT);
            var profile = customer.join("profile", JoinType.LEFT);
            String keyword = "%" + customerName.toLowerCase() + "%";

            return builder.or(
                    builder.like(builder.lower(customer.get("username")), keyword),
                    builder.like(builder.lower(profile.get("fullName")), keyword)
            );
        };
    }

    public static Specification<Booking> hasCheckInFrom(LocalDateTime checkIn) {
        return (root, query, builder) ->
                builder.greaterThanOrEqualTo(root.get("checkInDate"), checkIn);
    }

    public static Specification<Booking> hasCheckOutTo(LocalDateTime checkOut) {
        return (root, query, builder) ->
                builder.lessThanOrEqualTo(root.get("checkOutDate"), checkOut);
    }

    public static Specification<Booking> overlapsDateRange(LocalDateTime checkIn, LocalDateTime checkOut) {
        return (root, query, builder) ->
                builder.and(
                        builder.lessThan(root.get("checkInDate"), checkOut),
                        builder.greaterThan(root.get("checkOutDate"), checkIn)
                );
    }

    public static Specification<Booking> hasBookingStatus(BookingStatus bookingStatus) {
        return (root, query, builder) ->
                builder.equal(root.get("status"), bookingStatus);
    }

    public static Specification<Booking> hasPaymentMethod(PaymentMethod paymentMethod) {
        return (root, query, builder) ->
                builder.equal(root.get("paymentMethod"), paymentMethod);
    }

    public static Specification<Booking> hasRoomNumber(String roomNumber) {
        return (root, query, builder) -> {
            assert query != null;
            Subquery<Long> subquery = query.subquery(Long.class);
            var bookingDetail = subquery.from(BookingDetail.class);
            var room = bookingDetail.join("room", JoinType.INNER);

            subquery.select(bookingDetail.get("id"))
                    .where(
                            builder.equal(bookingDetail.get("booking"), root),
                            builder.like(builder.lower(room.get("roomNumber")),
                                    "%" + roomNumber.toLowerCase() + "%")
                    );

            return builder.exists(subquery);
        };
    }

    public static Specification<Booking> hasRoomStatus(RoomStatus roomStatus) {
        return (root, query, builder) -> {
            assert query != null;
            Subquery<Long> subquery = query.subquery(Long.class);
            var bookingDetail = subquery.from(BookingDetail.class);
            var room = bookingDetail.join("room", JoinType.INNER);

            subquery.select(bookingDetail.get("id"))
                    .where(
                            builder.equal(bookingDetail.get("booking"), root),
                            builder.equal(room.get("status"), roomStatus)
                    );

            return builder.exists(subquery);
        };
    }

    public static Specification<Booking> hasOverlappingRoomBooking(
            Long roomId,
            LocalDateTime checkIn,
            LocalDateTime checkOut,
            Collection<BookingStatus> statuses,
            Long excludedBookingId) {
        return (root, query, builder) -> {
            Subquery<Long> subquery = query.subquery(Long.class);
            var bookingDetail = subquery.from(BookingDetail.class);
            var booking = bookingDetail.join("booking", JoinType.INNER);

            var predicate = builder.and(
                    builder.equal(bookingDetail.get("room").get("id"), roomId),
                    booking.get("status").in(statuses),
                    builder.lessThan(booking.get("checkInDate"), checkOut),
                    builder.greaterThan(booking.get("checkOutDate"), checkIn)
            );

            if (excludedBookingId != null) {
                predicate = builder.and(predicate, builder.notEqual(booking.get("id"), excludedBookingId));
            }

            subquery.select(booking.get("id")).where(predicate);
            return root.get("id").in(subquery);
        };
    }
}
