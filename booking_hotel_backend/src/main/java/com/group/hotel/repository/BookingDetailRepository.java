package com.group.hotel.repository;

import com.group.hotel.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, Long> {
    @Query("""
            SELECT bd
            FROM BookingDetail bd
            JOIN FETCH bd.booking b
            JOIN FETCH bd.room r
            WHERE b.id IN :bookingIds
            """)
    List<BookingDetail> findByBookingIdInForBookingSearch(@Param("bookingIds") Collection<Long> bookingIds);

    @Query("""
            SELECT bd
            FROM BookingDetail bd
            JOIN FETCH bd.booking b
            JOIN FETCH bd.room r
            WHERE b.id = :bookingId
            """)
    Optional<BookingDetail> findByBookingId(@Param("bookingId") Long bookingId);
}
