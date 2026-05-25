package com.group.hotel.repository;

import com.group.hotel.entity.RoomType;
import com.group.hotel.entity.RoomTypeFurniture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomTypeFurnitureRepository
        extends JpaRepository<RoomTypeFurniture, Long> {
        List<RoomTypeFurniture> findByRoomTypeId(Long roomTypeId);
        void deleteByRoomTypeId(Long roomTypeId);

        boolean existsByFurnitureId(Long id);

        List<RoomTypeFurniture> findByRoomType(RoomType roomType);

}