package com.group.hotel.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.chatbot.AiKnowledgeRequest;
import com.group.hotel.dto.response.chatbot.AiKnowledgeResponse;
import com.group.hotel.dto.response.chatbot.ChatHistoryResponse;
import com.group.hotel.service.AiKnowledgeService;
import com.group.hotel.service.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
public class AiKnowledgeController {

    private final AiKnowledgeService knowledgeService;
    private final GeminiService geminiService; // Khai báo thêm service này để lấy lịch sử

    // ==========================================
    // PHẦN 1: QUẢN LÝ DỮ LIỆU TRAINING (KNOWLEDGE)
    // ==========================================

    @GetMapping("/knowledge")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getAllKnowledge(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Page<AiKnowledgeResponse> pageData = knowledgeService.getAllKnowledge(page, size, search);

        Map<String, Object> data = new HashMap<>();
        data.put("knowledgeBase", pageData.getContent());

        Map<String, Object> pageInfo = new HashMap<>();
        pageInfo.put("page", page);
        pageInfo.put("pageSize", size);
        pageInfo.put("totalElements", pageData.getTotalElements());

        data.put("pageInfo", pageInfo);

        return ResponseEntity.ok(BaseResponse.success(data, "Lấy danh sách dữ liệu training thành công"));
    }

    @PostMapping("/knowledge")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<AiKnowledgeResponse>> trainBot(@Valid @RequestBody AiKnowledgeRequest request) {
        AiKnowledgeResponse responseData = knowledgeService.trainKnowledge(request);
        return ResponseEntity.ok(BaseResponse.success(responseData, "Training data added successfully!"));
    }

    @PutMapping("/knowledge/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<AiKnowledgeResponse>> updateKnowledge(
            @PathVariable Long id,
            @Valid @RequestBody AiKnowledgeRequest request) {
        AiKnowledgeResponse responseData = knowledgeService.updateKnowledge(id, request);
        return ResponseEntity.ok(BaseResponse.success(responseData, "Update training data successfully!"));
    }

    @DeleteMapping("/knowledge/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<Void>> deleteKnowledge(@PathVariable Long id) {
        knowledgeService.deleteKnowledge(id);
        return ResponseEntity.ok(BaseResponse.success(null, "Delete training data successfully!"));
    }

    @GetMapping("/knowledge/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<AiKnowledgeResponse>> getKnowledgeById(@PathVariable Long id) {
        AiKnowledgeResponse responseData = knowledgeService.getById(id);
        return ResponseEntity.ok(BaseResponse.success(responseData, "Lấy chi tiết dữ liệu thành công"));
    }

    // ==========================================
    // PHẦN 2: LỊCH SỬ CHAT CỦA KHÁCH HÀNG (HISTORY)
    // ==========================================

    @GetMapping("/history")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getChatHistory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ChatHistoryResponse> pageData = geminiService.getChatHistory(search, startDate, endDate, sortBy, sortDir, page, size);

        Map<String, Object> data = new HashMap<>();
        data.put("history", pageData.getContent());

        Map<String, Object> paginationInfo = new HashMap<>();
        paginationInfo.put("page", pageData.getNumber());
        paginationInfo.put("pageSize", pageData.getSize());
        paginationInfo.put("totalElements", pageData.getTotalElements());
        paginationInfo.put("totalPages", pageData.getTotalPages());

        data.put("paginationInfo", paginationInfo);

        return ResponseEntity.ok(BaseResponse.success(data, "Lấy danh sách lịch sử trò chuyện thành công"));
    }
}