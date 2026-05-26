package com.group.hotel.room.repository;

import com.group.hotel.room.entity.RoomTypeFurniture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeFurnitureRepository extends JpaRepository<RoomTypeFurniture, Long> {

    boolean existsByFurnitureId(Long id);
    List<RoomTypeFurniture> findByRoomTypeId(Long roomTypeId);

    void deleteByRoomTypeId(Long roomTypeId);
}
