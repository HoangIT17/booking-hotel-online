package com.group.hotel.service.impl;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.BookingCreateRequest;
import com.group.hotel.dto.request.BookingSearchRequest;
import com.group.hotel.dto.request.BookingUpdateRequest;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.*;
import com.group.hotel.entity.Booking;
import com.group.hotel.entity.BookingDetail;
import com.group.hotel.entity.Payment;
import com.group.hotel.entity.Profile;
import com.group.hotel.entity.Room;
import com.group.hotel.entity.User;
import com.group.hotel.entity.Voucher;
import com.group.hotel.enums.BookingStatus;
import com.group.hotel.enums.RoomStatus;
import com.group.hotel.exception.BookingNotFoundException;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.exception.RoomNotFoundException;
import com.group.hotel.exception.VoucherConflictException;
import com.group.hotel.exception.VoucherNotFoundException;
import com.group.hotel.mapper.BookingMapper;
import com.group.hotel.repository.BookingDetailRepository;
import com.group.hotel.repository.BookingRepository;
import com.group.hotel.repository.PaymentRepository;
import com.group.hotel.repository.ReviewRepository;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.repository.VoucherRepository;
import com.group.hotel.service.BookingService;
import com.group.hotel.specification.BookingSpecification;
import com.group.hotel.specification.RoomSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private static final List<BookingStatus> BLOCKING_BOOKING_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN
    );

    private final RoomRepository roomRepository;
    private final ReviewRepository reviewRepository;
    private final VoucherRepository voucherRepository;
    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    @Override
    public PageResponse<RoomAvailableResponse> searchAvailableRooms(SearchRoomAvailableRequest request, Pageable pageable) {
        validateSearchRoomAvailableRequest(request);

        Specification<Room> spec = RoomSpecification.searchAvailableRooms(request);
        var rooms = roomRepository.findAll(spec, pageable);
        Map<Long, Double> averageRatingByRoomId = getAverageRatingByRoomId(rooms.getContent());

        return PageResponse.of(rooms.map(room -> toAvailableResponse(room, averageRatingByRoomId)));
    }

    @Override
    public CustomerRoomDetailResponse getCustomerRoomDetail(Long roomId) {
        Room room = roomRepository.findByIdWithFurnitures(roomId)
                .filter(foundRoom -> !foundRoom.isDeleted())
                .orElseThrow(RoomNotFoundException::new);

        List<CustomerRoomDetailResponse.FurnitureItem> furniture = room.getFurnitures() == null
                ? List.of()
                : room.getFurnitures().stream()
                .map(item -> CustomerRoomDetailResponse.FurnitureItem.builder()
                        .name(item.getFurnitureName())
                        .quantity(1)
                        .build())
                .toList();

        List<CustomerRoomDetailResponse.ReviewItem> reviews = reviewRepository.findByRoomId(roomId)
                .stream()
                .map(review -> CustomerRoomDetailResponse.ReviewItem.builder()
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .build())
                .toList();

        return CustomerRoomDetailResponse.builder()
                .roomId(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType() == null ? null : room.getRoomType().name())
                .price(room.getPrice())
                .capacity(room.getMaxPeople())
                .description(room.getDescription())
                .status("AVAILABLE")
                .imagesUrl(room.getImageUrl())
                .features(List.of())
                .furniture(furniture)
                .reviews(reviews)
                .build();
    }

    @Override
    public PageResponse<BookingSearchManagerResponse> searchBookings(BookingSearchRequest request, Pageable pageable) {
        Specification<Booking> spec = BookingSpecification.searchBookingRequest(request);
        Page<Booking> bookings = bookingRepository.findAll(spec, pageable);
        Map<Long, BookingDetail> bookingDetailByBookingId = getBookingDetailByBookingId(bookings.getContent());

        return PageResponse.of(bookings.map(booking ->
                toBookingSearchManagerResponse(booking, bookingDetailByBookingId.get(booking.getId()))));
    }

    @Override
    public BookingCreateResponse createBooking(BookingCreateRequest request) {
        validateBookingCreateRequest(request);

        Room room = roomRepository.findById(request.getRoomId())
                .filter(foundRoom -> !foundRoom.isDeleted())
                .orElseThrow(RoomNotFoundException::new);

        if (room.getStatus() != RoomStatus.READY) {
            throw new RoomConflictException("Room is not available");
        }
        if (room.getMaxPeople() != null && request.getNumGuests() > room.getMaxPeople()) {
            throw new RoomConflictException("numGuests exceeds room capacity");
        }
        if (hasOverlappingBookingForCreate(room, request)) {
            throw new RoomConflictException("Room is not available for the selected date range");
        }

        int numNights = Math.toIntExact(ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut()));
        BigDecimal roomTotal = calculateRoomTotal(room, numNights);
        Voucher voucher = resolveVoucher(request.getVoucherCode(), roomTotal, request.getCheckIn().atStartOfDay());
        BigDecimal totalPrice = roomTotal.subtract(calculateDiscount(voucher, roomTotal)).max(BigDecimal.ZERO);
        User customer = resolveCustomer(request.getCustomerId());

        Booking booking = bookingMapper.fromCreateRequest(request);
        prepareBookingForCreate(booking, customer, voucher, numNights, totalPrice);

        room.setStatus(RoomStatus.RESERVED);
        roomRepository.save(room);
        Booking savedBooking = bookingRepository.save(booking);
        createBookingDetail(savedBooking, room);
        createPayment(savedBooking, request);
        increaseVoucherUsedCount(voucher);

        BookingCreateResponse response = bookingMapper.toCreateResponse(savedBooking);
        response.setMessage("Booking created successfully");
        return response;
    }

    @Override
    public BookingUpdateResponse updateBookingCustomer(BookingUpdateRequest request) {
        if (request.getBookingStatus() != null && request.getBookingStatus() != BookingStatus.CANCELLED) {
            throw new RoomConflictException("Customer can only cancel booking");
        }

        BookingUpdateResponse response = updateBookingManager(request);
        response.setMessage(request.getBookingStatus() == BookingStatus.CANCELLED
                ? "Booking cancelled successfully"
                : "Booking updated successfully");
        return response;
    }

    @Override
    public BookingUpdateResponse updateBookingManager(BookingUpdateRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(BookingNotFoundException::new);
        BookingDetail bookingDetail = bookingDetailRepository.findByBookingId(request.getBookingId())
                .orElseThrow(BookingNotFoundException::new);
        Room room = bookingDetail.getRoom();

        LocalDate effectiveCheckIn = request.getCheckIn() == null ? booking.getCheckInDate() : request.getCheckIn();
        LocalDate effectiveCheckOut = request.getCheckOut() == null ? booking.getCheckOutDate() : request.getCheckOut();
        validateBookingUpdateDateRange(effectiveCheckIn, effectiveCheckOut);

        if (hasDateChange(request) && hasOverlappingBookingForUpdate(room, effectiveCheckIn, effectiveCheckOut, booking)) {
            throw new RoomConflictException("Room is not available for the selected date range");
        }

        bookingMapper.updateBookingFromRequest(request, booking);

        if (hasDateChange(request)) {
            recalculateBookingPrice(booking, room);
        }
        if (request.getBookingStatus() != null) {
            syncRoomStatusWithBookingStatus(room, request.getBookingStatus());
            roomRepository.save(room);
        }
        if (request.getPaymentMethod() != null) {
            updatePaymentMethod(booking, request);
        }

        Booking savedBooking = bookingRepository.save(booking);
        BookingUpdateResponse response = bookingMapper.toUpdateResponse(savedBooking);
        response.setMessage("Booking updated successfully");
        return response;
    }

    private void validateSearchRoomAvailableRequest(SearchRoomAvailableRequest request) {
        if (!request.isValidDateRange()) {
            throw new RoomConflictException("checkIn must be before checkOut");
        }
        if (request.getMinPrice() != null && request.getMaxPrice() != null
                && request.getMinPrice().compareTo(request.getMaxPrice()) > 0) {
            throw new RoomConflictException("minPrice must be less than or equal to maxPrice");
        }
    }

    private void syncRoomStatusWithBookingStatus(Room room, BookingStatus bookingStatus) {
        if (bookingStatus == BookingStatus.PENDING || bookingStatus == BookingStatus.CONFIRMED) {
            room.setStatus(RoomStatus.RESERVED);
        } else if (bookingStatus == BookingStatus.CHECKED_IN) {
            room.setStatus(RoomStatus.OCCUPIED);
        } else if (bookingStatus == BookingStatus.CHECKED_OUT
                || bookingStatus == BookingStatus.CANCELLED
                || bookingStatus == BookingStatus.REFUNDED) {
            room.setStatus(RoomStatus.READY);
        }
    }

    private void validateBookingUpdateDateRange(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkIn.isBefore(checkOut)) {
            throw new RoomConflictException("checkIn must be before checkOut");
        }
    }

    private boolean hasDateChange(BookingUpdateRequest request) {
        return request.getCheckIn() != null || request.getCheckOut() != null;
    }

    private boolean hasOverlappingBookingForCreate(Room room, BookingCreateRequest request) {
        Specification<Booking> overlapSpec = BookingSpecification.hasOverlappingRoomBooking(
                room.getId(),
                request.getCheckIn(),
                request.getCheckOut(),
                BLOCKING_BOOKING_STATUSES,
                null);
        return bookingRepository.count(overlapSpec) > 0;
    }

    private boolean hasOverlappingBookingForUpdate(Room room, LocalDate checkIn, LocalDate checkOut, Booking booking) {
        Specification<Booking> overlapSpec = BookingSpecification.hasOverlappingRoomBooking(
                room.getId(),
                checkIn,
                checkOut,
                BLOCKING_BOOKING_STATUSES,
                booking.getId());
        return bookingRepository.count(overlapSpec) > 0;
    }

    private void recalculateBookingPrice(Booking booking, Room room) {
        int numNights = Math.toIntExact(ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate()));
        booking.setNumNights(numNights);
        booking.setTotalPrice(calculateRoomTotal(room, numNights));
    }

    private BigDecimal calculateRoomTotal(Room room, int numNights) {
        return room.getPrice().multiply(BigDecimal.valueOf(numNights));
    }

    private User resolveCustomer(Long customerId) {
        if (customerId == null) {
            return null;
        }
        return userRepository.findById(customerId).orElse(null);
    }

    private void prepareBookingForCreate(
            Booking booking,
            User customer,
            Voucher voucher,
            int numNights,
            BigDecimal totalPrice) {
        booking.setCustomer(customer);
        booking.setVoucher(voucher);
        booking.setNumNights(numNights);
        booking.setExtraCharge(BigDecimal.ZERO);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);
    }

    private void createBookingDetail(Booking booking, Room room) {
        bookingDetailRepository.save(BookingDetail.builder()
                .booking(booking)
                .room(room)
                .build());
    }

    private void createPayment(Booking booking, BookingCreateRequest request) {
        paymentRepository.save(Payment.builder()
                .booking(booking)
                .paymentMethod(request.getPaymentMethod())
                .depositAmount(BigDecimal.ZERO)
                .totalPaid(BigDecimal.ZERO)
                .paymentDate(LocalDateTime.now())
                .build());
    }

    private void increaseVoucherUsedCount(Voucher voucher) {
        if (voucher == null) {
            return;
        }

        int usedCount = voucher.getUsedCount() == null ? 0 : voucher.getUsedCount();
        voucher.setUsedCount(usedCount + 1);
        voucherRepository.save(voucher);
    }

    private void updatePaymentMethod(Booking booking, BookingUpdateRequest request) {
        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseGet(() -> Payment.builder()
                        .booking(booking)
                        .depositAmount(BigDecimal.ZERO)
                        .totalPaid(BigDecimal.ZERO)
                        .paymentDate(LocalDateTime.now())
                        .build());
        payment.setPaymentMethod(request.getPaymentMethod());
        paymentRepository.save(payment);
    }

    private Map<Long, Double> getAverageRatingByRoomId(List<Room> rooms) {
        List<Long> roomIds = rooms.stream().map(Room::getId).toList();
        if (roomIds.isEmpty()) {
            return Map.of();
        }

        return reviewRepository.findAverageRatingsByRoomIds(roomIds)
                .stream()
                .collect(Collectors.toMap(
                        ReviewRepository.RoomAverageRatingProjection::getRoomId,
                        ReviewRepository.RoomAverageRatingProjection::getAverageRating));
    }

    private RoomAvailableResponse toAvailableResponse(Room room, Map<Long, Double> averageRatingByRoomId) {
        RoomAvailableResponse response = bookingMapper.toAvailableResponse(room);
        response.setStatus("AVAILABLE");
        response.setAverageRating(averageRatingByRoomId.getOrDefault(room.getId(), 0D));

        roomRepository.findImageUrlByRoomId(room.getId())
                .ifPresent(response::setImageUrl);
        return response;
    }

    private Map<Long, BookingDetail> getBookingDetailByBookingId(List<Booking> bookings) {
        List<Long> bookingIds = bookings.stream()
                .map(Booking::getId)
                .toList();
        if (bookingIds.isEmpty()) {
            return Map.of();
        }

        return bookingDetailRepository.findByBookingIdInForBookingSearch(bookingIds)
                .stream()
                .collect(Collectors.toMap(
                        bookingDetail -> bookingDetail.getBooking().getId(),
                        bookingDetail -> bookingDetail,
                        (first, ignored) -> first));
    }

    private BookingSearchManagerResponse toBookingSearchManagerResponse(Booking booking, BookingDetail bookingDetail) {
        User customer = booking.getCustomer();
        Profile profile = customer == null ? null : customer.getProfile();
        Room room = bookingDetail == null ? null : bookingDetail.getRoom();
        Payment payment = booking.getPayment();

        return BookingSearchManagerResponse.builder()
                .bookingId(booking.getId())
                .username(customer == null ? "" : customer.getUsername())
                .fullName(profile == null || profile.getFullName() == null ? "" : profile.getFullName())
                .roomNumber(room == null ? null : room.getRoomNumber())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .totalPrice(booking.getTotalPrice())
                .roomStatus(room == null ? null : room.getStatus())
                .bookingStatus(booking.getStatus())
                .paymentMethod(payment == null ? null : payment.getPaymentMethod())
                .build();
    }





    private void validateBookingCreateRequest(BookingCreateRequest request) {
        if (request.getRoomId() == null) {
            throw new RoomConflictException("roomId is required");
        }
        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new RoomConflictException("checkIn and checkOut are required");
        }
        if (!request.isValidDateRange()) {
            throw new RoomConflictException("checkIn must be before checkOut");
        }
        if (request.getNumGuests() == null) {
            throw new RoomConflictException("numGuests is required");
        }
    }

    private Voucher resolveVoucher(String voucherCode, BigDecimal bookingValueBeforeDiscount, LocalDateTime bookingDate) {
        if (voucherCode == null || voucherCode.isBlank()) {
            return null;
        }

        Voucher voucher = voucherRepository.findByCodeIgnoreCase(voucherCode.trim())
                .orElseThrow(VoucherNotFoundException::new);
        if (voucher.getStartDate() != null && bookingDate.isBefore(voucher.getStartDate())) {
            throw new VoucherConflictException("Voucher is not active");
        }
        if (voucher.getEndDate() != null && bookingDate.isAfter(voucher.getEndDate())) {
            throw new VoucherConflictException("Voucher has expired");
        }
        if (voucher.getUsageLimit() != null
                && voucher.getUsedCount() != null
                && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new VoucherConflictException("Voucher usage limit reached");
        }
        if (voucher.getMinBookingValue() != null
                && bookingValueBeforeDiscount.compareTo(voucher.getMinBookingValue()) < 0) {
            throw new VoucherConflictException("Booking value does not meet voucher minimum value");
        }

        return voucher;
    }

    private BigDecimal calculateDiscount(Voucher voucher, BigDecimal bookingValueBeforeDiscount) {
        if (voucher == null || voucher.getDiscountPercent() == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount = bookingValueBeforeDiscount
                .multiply(BigDecimal.valueOf(voucher.getDiscountPercent()))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        if (voucher.getMaxDiscount() != null && discount.compareTo(voucher.getMaxDiscount()) > 0) {
            return voucher.getMaxDiscount();
        }
        return discount;
    }


}
