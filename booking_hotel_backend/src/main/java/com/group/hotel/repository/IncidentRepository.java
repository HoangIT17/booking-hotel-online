package com.group.hotel.repository;

import com.group.hotel.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByRoomIdOrderByCreatedAtDesc(Long roomId);
}
