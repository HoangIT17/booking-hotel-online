package com.group.hotel.controller.staff;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.MaintenanceRequest;
import com.group.hotel.dto.response.CleaningTaskResponse;
import com.group.hotel.dto.response.MaintenanceResponse;
import com.group.hotel.dto.response.RoomTypeDetailResponse;
import com.group.hotel.security.UserPrincipal;
import com.group.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
    @PostMapping("s")
    public MaintenanceResponse createMaintenance(
            @ModelAttribute MaintenanceRequest request,
            @RequestHeader("staffId") Long staffId
    ) {
        return roomService.createMaintenanceRequest(request, staffId);
    }
    @GetMapping("/cleaning-tasks")
    public ResponseEntity<?> getTasks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String shift,
            @RequestParam(required = false) Integer floor
    ) {

        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        Long staffId = user.getId();

        return ResponseEntity.ok(
                roomService.getCleaningTasks(shift, floor, staffId, page)
        );
    }
}