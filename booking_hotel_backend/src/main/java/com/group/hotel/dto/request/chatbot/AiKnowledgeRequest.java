package com.group.hotel.dto.request.chatbot;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiKnowledgeRequest {
    @NotBlank(message = "Câu hỏi mẫu không được để trống")
    private String questionPattern;

    @NotBlank(message = "Câu trả lời không được để trống")
    private String answerContent;
}