package com.group.hotel.service.impl;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.ReviewCreateRequest;
import com.group.hotel.dto.request.ReviewUpdateRequest;
import com.group.hotel.dto.response.ReviewDeleteResponse;
import com.group.hotel.dto.response.ReviewListResponse;
import com.group.hotel.dto.response.ReviewResponse;
import com.group.hotel.entity.Booking;
import com.group.hotel.entity.Review;
import com.group.hotel.entity.User;
import com.group.hotel.enums.BookingStatus;
import com.group.hotel.exception.BookingNotFoundException;
import com.group.hotel.exception.ReviewNotFoundException;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.repository.BookingRepository;
import com.group.hotel.repository.ReviewRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.service.ReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<ReviewListResponse> getReviews(Pageable pageable) {
        return PageResponse.of(reviewRepository.findAll(pageable).map(this::toListResponse));
    }

    @Override
    public ReviewResponse createReview(ReviewCreateRequest request) {
        User customer = getCurrentCustomer();
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(BookingNotFoundException::new);

        validateCustomerCanReviewBooking(customer, booking);
        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new RoomConflictException("Booking has already been reviewed");
        }

        Review savedReview = reviewRepository.save(Review.builder()
                .customer(customer)
                .booking(booking)
                .rating(request.getRating())
                .comment(request.getComment())
                .build());

        ReviewResponse response = toResponse(savedReview);
        response.setMessage("Review created successfully");
        return response;
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            review.setComment(request.getComment());
        }

        Review savedReview = reviewRepository.save(review);
        ReviewResponse response = toResponse(savedReview);
        response.setMessage("Review updated successfully");
        return response;
    }

    @Override
    public ReviewDeleteResponse deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        reviewRepository.delete(review);
        return ReviewDeleteResponse.builder()
                .reviewId(reviewId)
                .message("Review deleted successfully")
                .build();
    }

    private void validateCustomerCanReviewBooking(User customer, Booking booking) {
        if (booking.getCustomer() == null
                || booking.getCustomer().getId() == null
                || !booking.getCustomer().getId().equals(customer.getId())) {
            throw new RoomConflictException("Customer can only review their own booking");
        }
        if (booking.getStatus() != BookingStatus.CHECKED_OUT) {
            throw new RoomConflictException("Customer can only review checked-out bookings");
        }
    }

    private User getCurrentCustomer() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || "anonymousUser".equals(authentication.getName())) {
            throw new RoomConflictException("Customer is required");
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RoomConflictException("Customer is required"));
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getId())
                .bookingId(review.getBooking() == null ? null : review.getBooking().getId())
                .customerId(review.getCustomer() == null ? null : review.getCustomer().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

    private ReviewListResponse toListResponse(Review review) {
        return ReviewListResponse.builder()
                .reviewId(review.getId())
                .username(review.getCustomer() == null ? null : review.getCustomer().getUsername())
                .comment(review.getComment())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
