package com.group.hotel.service.impl;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.BookingCreateRequest;
import com.group.hotel.dto.request.BookingSearchSystemRequest;
import com.group.hotel.dto.request.BookingSearchUserRequest;
import com.group.hotel.dto.request.BookingUpdateRequest;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.*;
import com.group.hotel.entity.*;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private static final String INVALID_DATE_RANGE_MESSAGE = "checkIn must be before checkOut";

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
        Room room = getActiveRoomWithFurniture(roomId);
        List<CustomerRoomDetailResponse.FurnitureItem> furniture =
                bookingMapper.toFurnitureItemList(room.getFurnitures());
        List<CustomerRoomDetailResponse.ReviewItem> reviews =
                bookingMapper.toReviewItemList(reviewRepository.findByRoomId(roomId));

        return bookingMapper.toCustomerRoomDetailResponse(room, furniture, reviews);
    }

    @Override
    public PageResponse<BookingSearchSystemResponse> searchBookingsSystem(BookingSearchSystemRequest request, Pageable pageable) {
        validateBookingSearchSystemRequest(request);

        Specification<Booking> spec = BookingSpecification.searchBookingRequest(request);
        Page<Booking> bookings = bookingRepository.findAll(spec, pageable);
        Map<Long, BookingDetail> bookingDetailByBookingId = getBookingDetailByBookingId(bookings.getContent());

        return PageResponse.of(bookings.map(booking ->
                bookingMapper.toSystemSearchResponse(booking, bookingDetailByBookingId.get(booking.getId()))));
    }

    @Override
    public PageResponse<BookingSearchCustomerResponse> searchCustomerBookings(BookingSearchUserRequest request, Pageable pageable) {
        validateBookingSearchUserRequest(request);

        User customer = getCurrentCustomer();
        Specification<Booking> spec = BookingSpecification.searchCustomerBookingRequest(request, customer.getId());
        Page<Booking> bookings = bookingRepository.findAll(spec, pageable);
        Map<Long, BookingDetail> bookingDetailByBookingId = getBookingDetailByBookingId(bookings.getContent());

        return PageResponse.of(bookings.map(booking ->
                bookingMapper.toCustomerSearchResponse(booking, bookingDetailByBookingId.get(booking.getId()))));
    }

    @Override
    public BookingCreateResponse createBooking(BookingCreateRequest request) {
        validateBookingCreateRequest(request);

        Room room = getActiveRoom(request.getRoomId());
        validateRoomCanBeBooked(room, request.getNumGuests(), request.getCheckIn(), request.getCheckOut());

        int numNights = calculateNumNights(request.getCheckIn(), request.getCheckOut());
        BigDecimal roomTotal = calculateRoomTotal(room, numNights);
        User customer = getCurrentCustomer();
        Voucher voucher = resolveVoucher(request.getVoucherCode(), roomTotal, request.getCheckIn().atStartOfDay());
        BigDecimal totalPrice = applyVoucherDiscount(roomTotal, voucher);

        Booking booking = bookingMapper.createBookingRequest(request);
        prepareBookingForCreate(booking, customer, voucher, numNights, totalPrice);

        room.setStatus(RoomStatus.RESERVED);
        roomRepository.save(room);
        Booking savedBooking = bookingRepository.save(booking);
        createBookingDetail(savedBooking, room);
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
        validateCurrentCustomerOwnsBooking(request.getBookingId());

        BookingUpdateResponse response = updateBookingManager(request);
        response.setMessage(request.getBookingStatus() == BookingStatus.CANCELLED
                ? "Booking cancelled successfully"
                : "Booking updated successfully");
        return response;
    }

    @Override
    public BookingUpdateResponse updateBookingManager(BookingUpdateRequest request) {
        BookingContext context = getBookingContext(request.getBookingId());
        Booking booking = context.booking();
        Room room = context.room();
        DateRange dateRange = resolveDateRange(request, booking);

        if (hasDateChange(request) && hasOverlappingBooking(room, dateRange.checkIn(), dateRange.checkOut(), booking.getId())) {
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
            booking.setPaymentDate(LocalDateTime.now());
        }

        Booking savedBooking = bookingRepository.save(booking);
        BookingUpdateResponse response = bookingMapper.toUpdateResponse(savedBooking);
        response.setMessage("Booking updated successfully");
        return response;
    }

    private void validateSearchRoomAvailableRequest(SearchRoomAvailableRequest request) {
        if (!request.isValidDateRange()) {
            throw new RoomConflictException(INVALID_DATE_RANGE_MESSAGE);
        }
        if (request.getMinPrice() != null && request.getMaxPrice() != null
                && request.getMinPrice().compareTo(request.getMaxPrice()) > 0) {
            throw new RoomConflictException("minPrice must be less than or equal to maxPrice");
        }
    }

    private void validateBookingSearchSystemRequest(BookingSearchSystemRequest request) {
        if (request != null && !request.isValidDateRange()) {
            throw new RoomConflictException(INVALID_DATE_RANGE_MESSAGE);
        }
    }

    private void validateBookingSearchUserRequest(BookingSearchUserRequest request) {
        if (request != null && !request.isValidDateRange()) {
            throw new RoomConflictException(INVALID_DATE_RANGE_MESSAGE);
        }
    }

    private Room getActiveRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .filter(room -> !room.isDeleted())
                .orElseThrow(RoomNotFoundException::new);
    }

    private Room getActiveRoomWithFurniture(Long roomId) {
        return roomRepository.findByIdWithFurnitures(roomId)
                .filter(room -> !room.isDeleted())
                .orElseThrow(RoomNotFoundException::new);
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

    private void validateDateRange(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkIn.isBefore(checkOut)) {
            throw new RoomConflictException(INVALID_DATE_RANGE_MESSAGE);
        }
    }

    private boolean hasDateChange(BookingUpdateRequest request) {
        return request.getCheckIn() != null || request.getCheckOut() != null;
    }

    private boolean hasOverlappingBooking(Room room, LocalDate checkIn, LocalDate checkOut, Long excludedBookingId) {
        Specification<Booking> overlapSpec = BookingSpecification.hasOverlappingRoomBooking(
                room.getId(),
                checkIn,
                checkOut,
                BLOCKING_BOOKING_STATUSES,
                excludedBookingId);
        return bookingRepository.count(overlapSpec) > 0;
    }

    private void validateRoomCanBeBooked(Room room, Integer numGuests, LocalDate checkIn, LocalDate checkOut) {
        if (room.getStatus() != RoomStatus.READY) {
            throw new RoomConflictException("Room is not available");
        }
        if (room.getMaxPeople() != null && numGuests > room.getMaxPeople()) {
            throw new RoomConflictException("numGuests exceeds room capacity");
        }
        if (hasOverlappingBooking(room, checkIn, checkOut, null)) {
            throw new RoomConflictException("Room is not available for the selected date range");
        }
    }

    private void recalculateBookingPrice(Booking booking, Room room) {
        int numNights = calculateNumNights(booking.getCheckInDate(), booking.getCheckOutDate());
        booking.setNumNights(numNights);
        booking.setTotalPrice(calculateRoomTotal(room, numNights));
    }

    private int calculateNumNights(LocalDate checkIn, LocalDate checkOut) {
        return Math.toIntExact(ChronoUnit.DAYS.between(checkIn, checkOut));
    }

    private BigDecimal calculateRoomTotal(Room room, int numNights) {
        return room.getPrice().multiply(BigDecimal.valueOf(numNights));
    }

    private BigDecimal applyVoucherDiscount(BigDecimal roomTotal, Voucher voucher) {
        return roomTotal.subtract(calculateDiscount(voucher, roomTotal)).max(BigDecimal.ZERO);
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
        booking.setPaymentDate(LocalDateTime.now());
    }

    private void createBookingDetail(Booking booking, Room room) {
        bookingDetailRepository.save(BookingDetail.builder()
                .booking(booking)
                .room(room)
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

    private User getCurrentCustomer() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || "anonymousUser".equals(authentication.getName())) {
            throw new RoomConflictException("Customer is required");
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RoomConflictException("Customer is required"));
    }

    private void validateCurrentCustomerOwnsBooking(Long bookingId) {
        if (bookingId == null) {
            throw new BookingNotFoundException();
        }

        User customer = getCurrentCustomer();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(BookingNotFoundException::new);
        if (booking.getCustomer() == null
                || booking.getCustomer().getId() == null
                || !booking.getCustomer().getId().equals(customer.getId())) {
            throw new RoomConflictException("Customer can only update their own booking");
        }
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
                        Function.identity(),
                        (first, ignored) -> first));
    }

    private void validateBookingCreateRequest(BookingCreateRequest request) {
        if (request.getRoomId() == null) {
            throw new RoomConflictException("roomId is required");
        }
        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new RoomConflictException("checkIn and checkOut are required");
        }
        validateDateRange(request.getCheckIn(), request.getCheckOut());
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

    private BookingContext getBookingContext(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(BookingNotFoundException::new);
        BookingDetail bookingDetail = bookingDetailRepository.findByBookingId(bookingId)
                .orElseThrow(BookingNotFoundException::new);
        return new BookingContext(booking, bookingDetail.getRoom());
    }

    private DateRange resolveDateRange(BookingUpdateRequest request, Booking booking) {
        LocalDate checkIn = request.getCheckIn() == null ? booking.getCheckInDate() : request.getCheckIn();
        LocalDate checkOut = request.getCheckOut() == null ? booking.getCheckOutDate() : request.getCheckOut();
        validateDateRange(checkIn, checkOut);
        return new DateRange(checkIn, checkOut);
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

    private record BookingContext(Booking booking, Room room) {
    }

    private record DateRange(LocalDate checkIn, LocalDate checkOut) {
    }
}
