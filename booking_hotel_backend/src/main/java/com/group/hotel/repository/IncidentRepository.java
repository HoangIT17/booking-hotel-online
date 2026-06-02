package com.group.hotel.repository;

import com.group.hotel.entity.Incident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IncidentRepository extends JpaRepository<Incident, Long>, JpaSpecificationExecutor<Incident> {
    List<Incident> findByRoomIdOrderByCreatedAtDesc(Long roomId);
    @Query("SELECT i FROM Incident i " +
            "LEFT JOIN FETCH i.room " +
            "LEFT JOIN FETCH i.staff s " +
            "LEFT JOIN FETCH s.profile " + // Khớp trực tiếp mối quan hệ User -> Profile nếu có
            "LEFT JOIN FETCH i.furniture " +
            "WHERE i.id = :id")
    Optional<Incident> findDetailById(@Param("id") Long id);
    @Query("SELECT i FROM Incident i WHERE i.furniture IS NOT NULL")
    Page<Incident> findDamagedOrLostItems(Pageable pageable);
}
