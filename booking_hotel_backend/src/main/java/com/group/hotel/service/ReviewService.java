package com.group.hotel.service;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.review.ReviewCreateRequest;
import com.group.hotel.dto.request.review.ReviewReplyRequest;
import com.group.hotel.dto.request.review.ReviewSearchRequest;
import com.group.hotel.dto.response.review.ReviewResponse;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse createReview(Long bookingId, ReviewCreateRequest request);
    ReviewResponse replyReview(Long reviewId, ReviewReplyRequest request);
    PageResponse<ReviewResponse> getAll(ReviewSearchRequest searchRequest, Pageable pageable);
    PageResponse<ReviewResponse> getMyReviews(ReviewSearchRequest searchRequest, Pageable pageable);
    ReviewResponse getByBookingId(Long bookingId);
    void deleteReview(Long reviewId);
}
