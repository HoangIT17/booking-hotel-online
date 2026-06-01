package com.group.hotel.controller.chatbot;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.ChatAskRequest;
import com.group.hotel.dto.response.ChatAskResponse;
import com.group.hotel.service.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
// 🌟 Đường dẫn chuẩn theo thiết kế
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
public class AiChatController {

    private final GeminiService geminiService;

    // API_SP_006: Khách hàng hỏi AI
    @PostMapping("/ask")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<BaseResponse<ChatAskResponse>> askAi(@Valid @RequestBody ChatAskRequest request) {
        ChatAskResponse responseData = geminiService.askGemini(request);
        return ResponseEntity.ok(BaseResponse.success(responseData, "AI đã phản hồi thành công!"));
    }
}