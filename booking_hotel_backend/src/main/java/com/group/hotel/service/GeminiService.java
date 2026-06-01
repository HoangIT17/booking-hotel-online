package com.group.hotel.service;

import com.group.hotel.dto.request.ChatAskRequest;
import com.group.hotel.dto.response.ChatAskResponse;
import com.group.hotel.dto.response.ChatHistoryResponse;
import org.springframework.data.domain.Page;

import java.time.LocalDate;

public interface GeminiService {

    ChatAskResponse askGemini(ChatAskRequest request);
    Page<ChatHistoryResponse> getChatHistory(String search, LocalDate startDate, LocalDate endDate,
                                             String sortBy, String sortDir, int page, int size);
}
