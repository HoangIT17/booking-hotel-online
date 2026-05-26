package com.group.hotel.booking.service;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.booking.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.room.dto.response.RoomAvailableResponse;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    PageResponse<RoomAvailableResponse> searchAvailableRooms(SearchRoomAvailableRequest request, Pageable pageable);
}
