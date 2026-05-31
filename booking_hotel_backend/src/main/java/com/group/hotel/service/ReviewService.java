package com.group.hotel.service;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.ReviewCreateRequest;
import com.group.hotel.dto.request.ReviewReplyRequest;
import com.group.hotel.dto.request.ReviewSearchRequest;
import com.group.hotel.dto.response.ReviewResponse;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse createReview(Long bookingId, ReviewCreateRequest request);
    ReviewResponse replyReview(Long reviewId, ReviewReplyRequest request);
    PageResponse<ReviewResponse> getAll(ReviewSearchRequest searchRequest, Pageable pageable);
    PageResponse<ReviewResponse> getMyReviews(Pageable pageable);
    ReviewResponse getByBookingId(Long bookingId);
}
