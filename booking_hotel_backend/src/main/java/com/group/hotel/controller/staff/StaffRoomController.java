package com.group.hotel.controller.staff;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.MaintenanceRequest;
import com.group.hotel.dto.response.MaintenanceResponse;
import com.group.hotel.dto.response.RoomTypeDetailResponse;
import com.group.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/staff")
public class StaffRoomController {

    private final RoomService roomService;

    @GetMapping("/{roomNumber}")
    public ResponseEntity<BaseResponse<RoomTypeDetailResponse>> getRoomDetail(
            @PathVariable String roomNumber
    ) {
        return ResponseEntity.ok(
                BaseResponse.success(roomService.getRoomTypeDetail(roomNumber))
        );
    }
    @PostMapping("/maintenance-requests")
    public MaintenanceResponse createMaintenance(
            @ModelAttribute MaintenanceRequest request,
            @RequestHeader("staffId") Long staffId
    ) {
        return roomService.createMaintenanceRequest(request, staffId);
    }
}