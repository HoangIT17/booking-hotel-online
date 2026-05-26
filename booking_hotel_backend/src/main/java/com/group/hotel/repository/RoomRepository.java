package com.group.hotel.repository;

import com.group.hotel.entity.Room;
import com.group.hotel.enums.RoomStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


import java.util.List;
import java.util.Optional;

public interface RoomRepository
        extends JpaRepository<Room, Long>,
        JpaSpecificationExecutor<Room> {

    Optional<Room> findByRoomNumber(String roomNumber);

    boolean existsByRoomNumberAndFloor(
            @NotBlank String roomNumber,
            @NotNull Integer floor
    );
    Optional<Room> findByRoomNumberAndIsDeletedFalse(String roomNumber);
    Page<Room> findByStatus(RoomStatus status, Pageable pageable);

}