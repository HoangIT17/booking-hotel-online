package com.group.hotel.repository;

import com.group.hotel.entity.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {

    Optional<RoomImage> findByRoomTypeIdAndIsThumbnailTrue(Long roomTypeId);
    List<RoomImage> findByRoomTypeId(Long roomTypeId);
}
