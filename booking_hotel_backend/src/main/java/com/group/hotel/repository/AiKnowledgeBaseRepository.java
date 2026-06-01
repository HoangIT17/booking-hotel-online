package com.group.hotel.repository;

import com.group.hotel.entity.AiKnowledgeBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AiKnowledgeBaseRepository extends
        JpaRepository<AiKnowledgeBase, Long>,
        JpaSpecificationExecutor<AiKnowledgeBase> {
}