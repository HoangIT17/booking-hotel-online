package com.group.hotel.repository;

import com.group.hotel.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
            SELECT bd.room.id AS roomId, AVG(r.rating) AS averageRating
            FROM Review r
            JOIN BookingDetail bd ON bd.booking = r.booking
            WHERE bd.room.id IN :roomIds
            GROUP BY bd.room.id
            """)
    List<RoomAverageRatingProjection> findAverageRatingsByRoomIds(@Param("roomIds") Collection<Long> roomIds);

    interface RoomAverageRatingProjection {
        Long getRoomId();

        Double getAverageRating();
    }
}
