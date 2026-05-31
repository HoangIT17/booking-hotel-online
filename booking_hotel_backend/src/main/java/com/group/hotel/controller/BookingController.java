package com.group.hotel.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.BookingCreateRequest;
import com.group.hotel.dto.request.BookingSearchSystemRequest;
import com.group.hotel.dto.request.BookingSearchUserRequest;
import com.group.hotel.dto.request.BookingUpdateRequest;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.*;
import com.group.hotel.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/api/v1/customer/rooms/search")
    public ResponseEntity<BaseResponse<PageResponse<RoomAvailableResponse>>> searchAvailableRooms(
            @Valid @ModelAttribute SearchRoomAvailableRequest searchRoomAvailableRequest,
            @PageableDefault(size = 10, sort = "price", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.searchAvailableRooms(searchRoomAvailableRequest, pageable)));
    }

    @GetMapping("/api/v1/customer/rooms/search/{roomId}")
    public ResponseEntity<BaseResponse<CustomerRoomDetailResponse>> getCustomerRoomDetail(@PathVariable Long roomId) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.getCustomerRoomDetail(roomId)));
    }

    @GetMapping("/api/v1/manager/reservation-search")
    public ResponseEntity<BaseResponse<PageResponse<BookingSearchSystemResponse>>> getManagerBookingSearch(
            @ModelAttribute @Valid BookingSearchSystemRequest bookingSearchRequest,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.searchBookingsSystem(bookingSearchRequest, pageable)));
    }

    @GetMapping("/api/v1/customer/reservation-search")
    public ResponseEntity<BaseResponse<PageResponse<BookingSearchCustomerResponse>>> getCustomerBookingSearch(
            @ModelAttribute @Valid BookingSearchUserRequest bookingSearchRequest,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.searchCustomerBookings(bookingSearchRequest, pageable)));
    }

    @PostMapping("/api/v1/reservation-create")
    public ResponseEntity<BaseResponse<BookingCreateResponse>> createBooking(
            @RequestBody @Valid BookingCreateRequest bookingCreateRequest) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.createBooking(bookingCreateRequest)));
    }

    @PutMapping("/api/v1/customer/reservation-update")
    public ResponseEntity<BaseResponse<BookingUpdateResponse>> updateBookingCustomer(
            @RequestBody @Valid BookingUpdateRequest bookingUpdateRequest) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.updateBookingCustomer(bookingUpdateRequest)));
    }

    @PutMapping("/api/v1/manager/reservation-update")
    public ResponseEntity<BaseResponse<BookingUpdateResponse>> updateBookingManager(
            @RequestBody @Valid BookingUpdateRequest bookingUpdateRequest) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.updateBookingManager(bookingUpdateRequest)));
    }
}