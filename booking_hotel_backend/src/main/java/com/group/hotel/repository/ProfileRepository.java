package com.group.hotel.repository;

import com.group.hotel.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    @Query("SELECT p FROM Profile p JOIN FETCH p.user u JOIN FETCH u.role WHERE u.username = :username")
    Optional<Profile> findByUserUsername(@Param("username") String username);
}