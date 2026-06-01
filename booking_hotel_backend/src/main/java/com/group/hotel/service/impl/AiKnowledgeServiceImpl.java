package com.group.hotel.service.impl;

import com.group.hotel.dto.request.AiKnowledgeRequest;
import com.group.hotel.dto.response.AiKnowledgeResponse;
import com.group.hotel.entity.AiKnowledgeBase;
import com.group.hotel.entity.User;
import com.group.hotel.exception.AppException;
import com.group.hotel.exception.ErrorCode;
import com.group.hotel.mapper.AiKnowledgeMapper;
import com.group.hotel.repository.AiKnowledgeBaseRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.service.AiKnowledgeService;
import com.group.hotel.specification.AiKnowledgeSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiKnowledgeServiceImpl implements AiKnowledgeService {

    private final AiKnowledgeBaseRepository knowledgeRepository;
    private final UserRepository userRepository;
    private final AiKnowledgeMapper aiKnowledgeMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<AiKnowledgeResponse> getAllKnowledge(int page, int size, String search) {
        // Excel quy định page bắt đầu từ 1, nhưng Spring Boot JPA page bắt đầu từ 0
        int pageNumber = page > 0 ? page - 1 : 0;
        Pageable pageable = PageRequest.of(pageNumber, size);

        Page<AiKnowledgeBase> entityPage = knowledgeRepository.findAll(
                AiKnowledgeSpecification.hasKeyword(search), pageable);

        return entityPage.map(aiKnowledgeMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AiKnowledgeResponse getById(Long id) {
        AiKnowledgeBase entity = knowledgeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND)); // Thay bằng ErrorCode thực tế của bạn
        return aiKnowledgeMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public AiKnowledgeResponse trainKnowledge(AiKnowledgeRequest request) {
        log.info("Training chatbot with pattern: {}", request.getQuestionPattern());

        // Lấy thông tin Admin đang đăng nhập
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AiKnowledgeBase entity = aiKnowledgeMapper.toEntity(request);
        entity.setAdmin(admin); // 🌟 Gán admin thao tác vào dòng dữ liệu

        return aiKnowledgeMapper.toResponse(knowledgeRepository.save(entity));
    }

    @Override
    @Transactional
    public AiKnowledgeResponse updateKnowledge(Long id, AiKnowledgeRequest request) {
        AiKnowledgeBase entity = knowledgeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        aiKnowledgeMapper.updateEntityFromRequest(request, entity);

        return aiKnowledgeMapper.toResponse(knowledgeRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteKnowledge(Long id) {
        log.info("Deleting AI Knowledge ID: {}", id);
        if (!knowledgeRepository.existsById(id)) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        knowledgeRepository.deleteById(id);
    }
}