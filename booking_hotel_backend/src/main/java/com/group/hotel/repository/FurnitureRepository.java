package com.group.hotel.repository;

import com.group.hotel.entity.Furniture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FurnitureRepository extends JpaRepository<Furniture, Long>, JpaSpecificationExecutor<Furniture> {
    boolean existsByFurnitureNameIgnoreCase(String name);
}
