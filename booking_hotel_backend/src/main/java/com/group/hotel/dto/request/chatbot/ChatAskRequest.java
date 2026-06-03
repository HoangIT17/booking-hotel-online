package com.group.hotel.dto.request.chatbot;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatAskRequest {
    @NotBlank(message = "Tin nhắn không được để trống")
    private String message;
}