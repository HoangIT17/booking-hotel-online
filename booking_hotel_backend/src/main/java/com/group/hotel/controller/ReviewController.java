package com.group.hotel.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.review.ReviewCreateRequest;
import com.group.hotel.dto.request.review.ReviewReplyRequest;
import com.group.hotel.dto.request.review.ReviewSearchRequest;
import com.group.hotel.dto.response.review.ReviewResponse;
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

    @PostMapping("/api/v1/customer/reviews/{bookingId}")
    public ResponseEntity<BaseResponse<ReviewResponse>> createReview(
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewCreateRequest request) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.createReview(bookingId, request)));
    }

    @GetMapping("/api/v1/customer/reviews")
    public ResponseEntity<BaseResponse<PageResponse<ReviewResponse>>> getMyReviews(
            @ModelAttribute ReviewSearchRequest searchRequest,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.getMyReviews(searchRequest, pageable)));
    }

    @GetMapping("/api/v1/customer/reviews/booking/{bookingId}")
    public ResponseEntity<BaseResponse<ReviewResponse>> getByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.getByBookingId(bookingId)));
    }

    @DeleteMapping("/api/v1/reviews/{reviewId}")
    public ResponseEntity<BaseResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(BaseResponse.success(null));
    }
}
