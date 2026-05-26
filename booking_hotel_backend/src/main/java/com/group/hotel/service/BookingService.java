package com.group.hotel.service;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.RoomAvailableResponse;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    PageResponse<RoomAvailableResponse> searchAvailableRooms(SearchRoomAvailableRequest request, Pageable pageable);
}
