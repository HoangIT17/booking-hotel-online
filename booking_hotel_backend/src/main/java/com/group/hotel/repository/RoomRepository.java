package com.group.hotel.repository;

import com.group.hotel.entity.Room;
import com.group.hotel.enums.RoomStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.furnitures WHERE r.id = :id")
    Optional<Room> findByIdWithFurnitures(@Param("id") Long id);

    Optional<Room> findByRoomNumberAndIsDeletedFalse(String roomNumber);
    Page<Room> findByStatus(RoomStatus status, Pageable pageable);


    @Query("SELECT r.imageUrl FROM Room r WHERE r.id = :roomId AND r.isDeleted = false")
    Optional<String> findImageUrlByRoomId(Long roomId);

    List<Room> findByIsDeletedFalse();

    List<Room> findByFloorAndIsDeletedFalse(Integer floor);

    List<Room> findByStatusAndIsDeletedFalse(RoomStatus status);

    List<Room> findByFloorAndStatusAndIsDeletedFalse(
            Integer floor,
            RoomStatus status
    );


}