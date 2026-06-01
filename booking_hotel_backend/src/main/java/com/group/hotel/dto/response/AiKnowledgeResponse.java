package com.group.hotel.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AiKnowledgeResponse {
    private Long id;
    private String questionPattern;
    private String answerContent;
    private String createdByAdminName;
}