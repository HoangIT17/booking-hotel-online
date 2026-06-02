package com.group.hotel.service;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.ReviewCreateRequest;
import com.group.hotel.dto.request.ReviewUpdateRequest;
import com.group.hotel.dto.response.ReviewDeleteResponse;
import com.group.hotel.dto.response.ReviewListResponse;
import com.group.hotel.dto.response.ReviewResponse;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    PageResponse<ReviewListResponse> getReviews(Pageable pageable);

    ReviewResponse createReview(ReviewCreateRequest request);

    ReviewResponse updateReview(Long reviewId, ReviewUpdateRequest request);

    ReviewDeleteResponse deleteReview(Long reviewId);
}
