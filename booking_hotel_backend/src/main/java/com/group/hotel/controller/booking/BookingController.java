package com.group.hotel.controller.booking;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.CustomerRoomDetailResponse;
import com.group.hotel.dto.response.RoomAvailableResponse;
import com.group.hotel.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/api/customer/rooms/search")
    public ResponseEntity<BaseResponse<PageResponse<RoomAvailableResponse>>> searchAvailableRooms(
            @Valid @ModelAttribute SearchRoomAvailableRequest searchRoomAvailableRequest,
            @PageableDefault(size = 10, sort = "price", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.searchAvailableRooms(searchRoomAvailableRequest, pageable)));
    }

    @GetMapping("/api/customer/rooms/search/{roomId}")
    public ResponseEntity<BaseResponse<CustomerRoomDetailResponse>> getCustomerRoomDetail(@PathVariable Long roomId) {
        return ResponseEntity.ok(BaseResponse.success(bookingService.getCustomerRoomDetail(roomId)));
    }
}
