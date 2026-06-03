package com.group.hotel.service;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.booking.BookingCreateRequest;
import com.group.hotel.dto.request.booking.BookingSearchSystemRequest;
import com.group.hotel.dto.request.booking.BookingSearchUserRequest;
import com.group.hotel.dto.request.booking.BookingUpdateRequest;
import com.group.hotel.dto.request.room.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.booking.BookingCreateResponse;
import com.group.hotel.dto.response.booking.BookingSearchCustomerResponse;
import com.group.hotel.dto.response.booking.BookingSearchSystemResponse;
import com.group.hotel.dto.response.booking.BookingUpdateResponse;
import com.group.hotel.dto.response.room.CustomerRoomDetailResponse;
import com.group.hotel.dto.response.room.RoomAvailableResponse;
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
