package com.group.hotel.repository;

import com.group.hotel.entity.Room;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.lang.ScopedValue;
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

}