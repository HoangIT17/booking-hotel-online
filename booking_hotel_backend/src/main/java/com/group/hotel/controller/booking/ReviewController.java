package com.group.hotel.controller.booking;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.ReviewCreateRequest;
import com.group.hotel.dto.request.ReviewUpdateRequest;
import com.group.hotel.dto.response.ReviewDeleteResponse;
import com.group.hotel.dto.response.ReviewListResponse;
import com.group.hotel.dto.response.ReviewResponse;
import com.group.hotel.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/api/v1/reviews")
    public ResponseEntity<BaseResponse<PageResponse<ReviewListResponse>>> getReviews(
            @PageableDefault(size = 3, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.getReviews(pageable)));
    }

    @PostMapping("/api/v1/customer/reviews")
    public ResponseEntity<BaseResponse<ReviewResponse>> createReview(
            @RequestBody @Valid ReviewCreateRequest request
    ) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.createReview(request)));
    }

    @PutMapping("/api/v1/manager/reviews/{reviewId}")
    public ResponseEntity<BaseResponse<ReviewResponse>> updateReview(
            @PathVariable Long reviewId,
            @RequestBody @Valid ReviewUpdateRequest request
    ) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.updateReview(reviewId, request)));
    }

    @DeleteMapping("/api/v1/manager/reviews/{reviewId}")
    public ResponseEntity<BaseResponse<ReviewDeleteResponse>> deleteReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(BaseResponse.success(reviewService.deleteReview(reviewId)));
    }
}
