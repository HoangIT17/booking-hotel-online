package com.group.hotel.service;

import com.group.hotel.dto.request.AiKnowledgeRequest;
import com.group.hotel.dto.response.AiKnowledgeResponse;
import org.springframework.data.domain.Page;

public interface AiKnowledgeService {
    Page<AiKnowledgeResponse> getAllKnowledge(int page, int size, String search);
    AiKnowledgeResponse getById(Long id);
    AiKnowledgeResponse trainKnowledge(AiKnowledgeRequest request);
    AiKnowledgeResponse updateKnowledge(Long id, AiKnowledgeRequest request);
    void deleteKnowledge(Long id);
}