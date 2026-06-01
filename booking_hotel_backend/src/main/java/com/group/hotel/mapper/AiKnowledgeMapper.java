package com.group.hotel.mapper;

import com.group.hotel.dto.request.AiKnowledgeRequest;
import com.group.hotel.dto.response.AiKnowledgeResponse;
import com.group.hotel.entity.AiKnowledgeBase;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AiKnowledgeMapper {

    @Mapping(target = "createdByAdminName", source = "admin.username")
    AiKnowledgeResponse toResponse(AiKnowledgeBase entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true) // Admin sẽ được set thủ công bằng user đăng nhập
    AiKnowledgeBase toEntity(AiKnowledgeRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true)
    void updateEntityFromRequest(AiKnowledgeRequest request, @MappingTarget AiKnowledgeBase entity);
}