package com.group.hotel.controller.admin;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.ReviewCreateRequest;
import com.group.hotel.dto.request.ReviewReplyRequest;
import com.group.hotel.dto.request.ReviewSearchRequest;
import com.group.hotel.dto.response.ReviewResponse;
import com.group.hotel.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ── Staff ───────────────────────────────────────

    @GetMapping("/api/v1/reviews")
    public ResponseEntity<BaseResponse<PageResponse<ReviewResponse>>> getAll(
            @ModelAttribute ReviewSearchRequest searchRequest,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.getAll(searchRequest, pageable)));
    }

    @PutMapping("/api/v1/reviews/{reviewId}/reply")
    public ResponseEntity<BaseResponse<ReviewResponse>> reply(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewReplyRequest request) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.replyReview(reviewId, request)));
    }

    // ── Customer ──────────────────────────────────────────────

    @PostMapping("/api/v1/customer/reviews/{bookingId}")
    public ResponseEntity<BaseResponse<ReviewResponse>> createReview(
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewCreateRequest request) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.createReview(bookingId, request)));
    }

    @GetMapping("/api/v1/customer/reviews")
    public ResponseEntity<BaseResponse<PageResponse<ReviewResponse>>> getMyReviews(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.getMyReviews(pageable)));
    }

    @GetMapping("/api/v1/customer/reviews/booking/{bookingId}")
    public ResponseEntity<BaseResponse<ReviewResponse>> getByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.getByBookingId(bookingId)));
    }
}
