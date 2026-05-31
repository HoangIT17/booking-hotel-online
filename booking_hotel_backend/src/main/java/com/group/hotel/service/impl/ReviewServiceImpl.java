package com.group.hotel.service.impl;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.ReviewCreateRequest;
import com.group.hotel.dto.request.ReviewReplyRequest;
import com.group.hotel.dto.request.ReviewSearchRequest;
import com.group.hotel.dto.response.ReviewResponse;
import com.group.hotel.entity.Booking;
import com.group.hotel.entity.Review;
import com.group.hotel.entity.User;
import com.group.hotel.enums.BookingStatus;
import com.group.hotel.exception.ReviewConflictException;
import com.group.hotel.exception.ReviewNotFoundException;
import com.group.hotel.mapper.ReviewMapper;
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
    private final ReviewMapper reviewMapper;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ReviewConflictException("Không tìm thấy người dùng"));
    }

    @Override
    @Transactional
    public ReviewResponse createReview(Long bookingId, ReviewCreateRequest request) {
        User currentUser = getCurrentUser();

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ReviewConflictException("Không tìm thấy đơn đặt phòng"));

        if (!booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new ReviewConflictException("Bạn không có quyền đánh giá đơn đặt phòng này");
        }

        if (booking.getStatus() != BookingStatus.CHECKED_OUT) {
            throw new ReviewConflictException("Chỉ có thể đánh giá sau khi trả phòng");
        }

        if (reviewRepository.existsByBookingId(bookingId)) {
            throw new ReviewConflictException("Đơn đặt phòng này đã được đánh giá");
        }

        Review review = reviewMapper.fromCreate(request);
        review.setCustomer(currentUser);
        review.setBooking(booking);

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewResponse replyReview(Long reviewId, ReviewReplyRequest request) {
        User currentUser = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException());

        reviewMapper.fromReply(request, review);
        review.setRepliedBy(currentUser);
        review.setRepliedAt(LocalDateTime.now());

        return reviewMapper.toResponse(reviewRepository.save(review));
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

        return PageResponse.of(reviewRepository.findAll(spec, pageable).map(reviewMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getMyReviews(Pageable pageable) {
        User currentUser = getCurrentUser();
        return PageResponse.of(reviewRepository.findByCustomerId(currentUser.getId(), pageable)
                .map(reviewMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getByBookingId(Long bookingId) {
        return reviewMapper.toResponse(
                reviewRepository.findByBookingId(bookingId)
                        .orElseThrow(() -> new ReviewNotFoundException())
        );
    }
}
