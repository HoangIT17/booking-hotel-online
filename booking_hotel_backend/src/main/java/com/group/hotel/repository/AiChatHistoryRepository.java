package com.group.hotel.repository;

import com.group.hotel.entity.AiChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AiChatHistoryRepository extends
        JpaRepository<AiChatHistory, Long>,
        JpaSpecificationExecutor<AiChatHistory> {
}