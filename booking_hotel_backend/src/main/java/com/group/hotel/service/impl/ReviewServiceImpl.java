package com.group.hotel.service.impl;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.review.ReviewCreateRequest;
import com.group.hotel.dto.request.review.ReviewReplyRequest;
import com.group.hotel.dto.request.review.ReviewSearchRequest;
import com.group.hotel.dto.response.review.ReviewResponse;
import com.group.hotel.entity.Booking;
import com.group.hotel.entity.Review;
import com.group.hotel.entity.User;
import com.group.hotel.enums.BookingStatus;
import com.group.hotel.exception.ReviewNotFoundException;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.repository.BookingRepository;
import com.group.hotel.repository.ReviewRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.service.ReviewService;
import com.group.hotel.specification.ReviewSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RoomConflictException("Không tìm thấy người dùng"));
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setBookingId(review.getBooking() == null ? null : review.getBooking().getId());
        res.setCustomerId(review.getCustomer() == null ? null : review.getCustomer().getId());
        res.setCustomerName(review.getCustomer() == null ? null : review.getCustomer().getUsername());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setStaffReply(review.getStaffReply());
        res.setRepliedByName(review.getRepliedBy() == null ? null : review.getRepliedBy().getUsername());
        res.setRepliedAt(review.getRepliedAt());
        res.setCreatedAt(review.getCreatedAt());
        res.setUpdatedAt(review.getUpdatedAt());
        return res;
    }

    @Override
    @Transactional
    public ReviewResponse createReview(Long bookingId, ReviewCreateRequest request) {
        User currentUser = getCurrentUser();

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RoomConflictException("Không tìm thấy đơn đặt phòng"));

        if (!booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new RoomConflictException("Bạn không có quyền đánh giá đơn đặt phòng này");
        }
        if (booking.getStatus() != BookingStatus.CHECKED_OUT) {
            throw new RoomConflictException("Chỉ có thể đánh giá sau khi trả phòng");
        }
        if (reviewRepository.existsByBookingId(bookingId)) {
            throw new RoomConflictException("Đơn đặt phòng này đã được đánh giá");
        }

        Review saved = reviewRepository.save(Review.builder()
                .customer(currentUser)
                .booking(booking)
                .rating(request.getRating())
                .comment(request.getComment())
                .build());

        return toResponse(saved);
    }

    @Override
    @Transactional
    public ReviewResponse replyReview(Long reviewId, ReviewReplyRequest request) {
        User currentUser = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);

        review.setStaffReply(request.getStaffReply());
        review.setRepliedBy(currentUser);
        review.setRepliedAt(LocalDateTime.now());

        return toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getAll(ReviewSearchRequest searchRequest, Pageable pageable) {
        Specification<Review> spec = (root, query, builder) -> builder.conjunction();

        if (searchRequest.getHasReply() != null) {
            spec = spec.and(ReviewSpecification.hasReply(searchRequest.getHasReply()));
        }
        if (searchRequest.getRating() != null) {
            spec = spec.and(ReviewSpecification.hasRating(searchRequest.getRating()));
        }
        if (searchRequest.getFromDate() != null) {
            spec = spec.and(ReviewSpecification.fromDate(searchRequest.getFromDate()));
        }
        if (searchRequest.getToDate() != null) {
            spec = spec.and(ReviewSpecification.toDate(searchRequest.getToDate()));
        }
        if (searchRequest.getCustomerName() != null && !searchRequest.getCustomerName().isBlank()) {
            spec = spec.and(ReviewSpecification.hasCustomerName(searchRequest.getCustomerName()));
        }

        return PageResponse.of(reviewRepository.findAll(spec, pageable).map(this::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getMyReviews(ReviewSearchRequest searchRequest, Pageable pageable) {
        User currentUser = getCurrentUser();
        Specification<Review> spec = ReviewSpecification.hasCustomerId(currentUser.getId());

        if (searchRequest.getRating() != null) {
            spec = spec.and(ReviewSpecification.hasRating(searchRequest.getRating()));
        }
        if (searchRequest.getFromDate() != null) {
            spec = spec.and(ReviewSpecification.fromDate(searchRequest.getFromDate()));
        }
        if (searchRequest.getToDate() != null) {
            spec = spec.and(ReviewSpecification.toDate(searchRequest.getToDate()));
        }

        return PageResponse.of(reviewRepository.findAll(spec, pageable).map(this::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getByBookingId(Long bookingId) {
        return toResponse(
                reviewRepository.findByBookingId(bookingId)
                        .orElseThrow(ReviewNotFoundException::new)
        );
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(ReviewNotFoundException::new);
        reviewRepository.delete(review);
    }
}
