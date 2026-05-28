package com.group.hotel.controller.staff;

import com.group.hotel.dto.response.RoomDetailResponse;
import com.group.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final RoomService roomService;

    @GetMapping("/rooms/{roomNumber}")
    public RoomDetailResponse getRoomDetail(
            @PathVariable String roomNumber) {

        return roomService.getRoomDetail(roomNumber);
    }
}