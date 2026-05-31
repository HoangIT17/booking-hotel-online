package com.group.hotel.service;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.BookingCreateRequest;
import com.group.hotel.dto.request.BookingSearchSystemRequest;
import com.group.hotel.dto.request.BookingSearchUserRequest;
import com.group.hotel.dto.request.BookingUpdateRequest;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.*;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    PageResponse<RoomAvailableResponse> searchAvailableRooms(SearchRoomAvailableRequest request, Pageable pageable);

    CustomerRoomDetailResponse getCustomerRoomDetail(Long roomId);

    BookingCreateResponse createBooking(BookingCreateRequest request);

    PageResponse<BookingSearchSystemResponse> searchBookingsSystem(BookingSearchSystemRequest request, Pageable pageable);

    PageResponse<BookingSearchCustomerResponse> searchCustomerBookings(BookingSearchUserRequest request, Pageable pageable);

    BookingUpdateResponse updateBookingCustomer(BookingUpdateRequest request);

    BookingUpdateResponse updateBookingManager(BookingUpdateRequest request);
}
