package com.group.hotel.service.impl;

import com.group.hotel.dto.request.ChatAskRequest;
import com.group.hotel.dto.response.ChatAskResponse;
import com.group.hotel.dto.response.ChatHistoryResponse;
import com.group.hotel.entity.AiChatHistory;
import com.group.hotel.entity.AiKnowledgeBase;
import com.group.hotel.entity.Profile;
import com.group.hotel.entity.User;
import com.group.hotel.exception.AppException;
import com.group.hotel.exception.ErrorCode;
import com.group.hotel.repository.AiChatHistoryRepository;
import com.group.hotel.repository.AiKnowledgeBaseRepository;
import com.group.hotel.repository.ProfileRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.service.GeminiService;
import com.group.hotel.specification.AiChatHistorySpecification;
import com.group.hotel.specification.AiKnowledgeSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final AiKnowledgeBaseRepository knowledgeRepository;
    private final AiChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    // 🌟 1. Gọi thêm ProfileRepository để lấy họ tên
    private final ProfileRepository profileRepository;

    private final RestTemplate restTemplate;

    // ==========================================
    // 1. NGHIỆP VỤ CUSTOMER CHAT VỚI AI
    // ==========================================
    @Override
    @Transactional
    public ChatAskResponse askGemini(ChatAskRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String userQuestion = request.getMessage();

        List<AiKnowledgeBase> relatedKnowledge = knowledgeRepository.findAll(AiKnowledgeSpecification.hasKeyword(userQuestion));

        StringBuilder contextBuilder = new StringBuilder();
        if (!relatedKnowledge.isEmpty()) {
            contextBuilder.append("HOTEL KNOWLEDGE BASE:\n");
            for (AiKnowledgeBase k : relatedKnowledge) {
                contextBuilder.append(String.format("- Q: %s -> A: %s\n", k.getQuestionPattern(), k.getAnswerContent()));
            }
        }

        String finalPrompt = String.format(
                "Bạn là trợ lý AI ảo của Khách sạn hạng sang. Hãy trả lời khách hàng một cách lịch sự, chuyên nghiệp bằng tiếng Việt.\n" +
                        "Dữ liệu kiến thức khách sạn:\n%s\n" +
                        "Câu hỏi của khách: %s\n\n" +
                        "Chỉ dẫn: Ưu tiên dùng dữ liệu khách sạn cung cấp ở trên. Trả lời ngắn gọn, súc tích.",
                contextBuilder.length() > 0 ? contextBuilder.toString() : "Không có dữ liệu đặc thù, hãy dùng kiến thức chung.",
                userQuestion
        );

        String aiReply = callGeminiApi(finalPrompt);

        AiChatHistory history = AiChatHistory.builder()
                .customer(customer)
                .question(userQuestion)
                .aiResponse(aiReply)
                .build();
        chatHistoryRepository.save(history);

        return ChatAskResponse.builder()
                .reply(aiReply)
                .timestamp(LocalDateTime.now())
                .build();
    }

    private String callGeminiApi(String promptText) {
        String url = apiUrl + "?key=" + apiKey.trim();

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", promptText)))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 1024
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {

                // 🌟 2. ĐÃ VÁ LỖI responseBody TẠI ĐÂY
                Map<String, Object> responseBody = response.getBody();
                List<?> candidates = (List<?>) responseBody.get("candidates");

                if (candidates != null && !candidates.isEmpty()) {
                    Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
                    List<?> parts = (List<?>) content.get("parts");
                    return ((Map<?, ?>) parts.get(0)).get("text").toString();
                }
            }
            return "Hệ thống AI đang bận, vui lòng thử lại sau!";
        } catch (Exception e) {
            log.error("GEMINI API ERROR: {}", e.getMessage());
            return "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng liên hệ Lễ tân.";
        }
    }


//    private String callGeminiApi(String promptText) {
//        // 1. Nhét trực tiếp API Key vào URL
//        String finalUrl = apiUrl + "?key=" + apiKey.trim();
//
//        Map<String, Object> body = Map.of(
//                "contents", List.of(
//                        Map.of("parts", List.of(Map.of("text", promptText)))
//                ),
//                "generationConfig", Map.of(
//                        // 🌟 Đã gỡ thinkingConfig để tương thích với bản Flash-Latest
//                        "temperature", 0.7,
//                        "maxOutputTokens", 2048,
//                        "topP", 0.95
//                )
//        );
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        // Không set Header X-goog-api-key nữa để tránh xung đột
//
//        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
//
//        try {
//            log.info("--- Calling Gemini API (Model: flash-latest) ---");
//            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);
//
//            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
//                return parseGeminiResponse(response.getBody());
//            }
//            return "Hệ thống AI đang bận. Vui lòng đợi trong giây lát!";
//
//        } catch (Exception e) {
//            log.error("GEMINI API ERROR: {}", e.getMessage());
//
//            // 🌟 Sửa TẠM THỜI dòng này để ép nó in lỗi thật sự ra màn hình
//            return "LỖI THẬT SỰ TỪ GOOGLE LÀ: " + e.getMessage();
//        }
//    }


    private String parseGeminiResponse(Map<String, Object> responseBody) {
        try {
            List<?> candidates = (List<?>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "No response.";

            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");

            return ((Map<?, ?>) parts.get(0)).get("text").toString();
        } catch (Exception e) {
            return "Error parsing response.";
        }
    }
    // ==========================================
    // 2. NGHIỆP VỤ ADMIN THEO DÕI LỊCH SỬ CHAT
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public Page<ChatHistoryResponse> getChatHistory(String search, LocalDate startDate, LocalDate endDate,
                                                    String sortBy, String sortDir, int page, int size) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AiChatHistory> historyPage = chatHistoryRepository.findAll(
                AiChatHistorySpecification.filterHistory(search, startDate, endDate), pageable);

        return historyPage.map(h -> {
            // 🌟 3. CHUẨN HÓA LOGIC LẤY TÊN TỪ BẢNG PROFILE
            String finalCustomerName = "Khách ẩn danh";
            if (h.getCustomer() != null) {
                Profile profile = profileRepository.findByUserUsername(h.getCustomer().getUsername()).orElse(null);
                if (profile != null && profile.getFullName() != null) {
                    finalCustomerName = profile.getFullName();
                } else {
                    finalCustomerName = h.getCustomer().getUsername(); // Lấy username chữa cháy nếu chưa lập profile
                }
            }

            return ChatHistoryResponse.builder()
                    .id(h.getId())
                    .customerName(finalCustomerName) // Ép tên vào đây
                    .question(h.getQuestion())
                    .aiResponse(h.getAiResponse())
                    .createdAt(h.getCreatedAt())
                    .build();
        });
    }
}