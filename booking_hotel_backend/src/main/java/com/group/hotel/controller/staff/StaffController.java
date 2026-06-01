package com.group.hotel.controller.staff;

import com.group.hotel.dto.request.CreateIncidentRequest;
import com.group.hotel.dto.request.CreateMaintenanceRequest;
import com.group.hotel.dto.request.UpdateRoomStatusRequest;
import com.group.hotel.dto.response.AcceptCleaningTaskResponse;
import com.group.hotel.dto.response.MaintenanceResponse;
import com.group.hotel.dto.response.RoomDetailResponse;
import com.group.hotel.dto.response.UpdateRoomStatusResponse;
import com.group.hotel.security.UserPrincipal;
import com.group.hotel.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

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
    @PostMapping(
            value = "/maintenance-requests",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MaintenanceResponse>
    createMaintenanceRequest(

            @RequestParam String roomNumber,

            @RequestParam Long furnitureItemId,

            @RequestParam String incidentDescription,

            @RequestPart(required = false)
            MultipartFile image
    ) {

        CreateMaintenanceRequest request =
                new CreateMaintenanceRequest();

        request.setRoomNumber(roomNumber);
        request.setFurnitureItemId(furnitureItemId);
        request.setIncidentDescription(
                incidentDescription
        );
        request.setImage(image);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        roomService
                                .createMaintenanceRequest(
                                        request
                                )
                );
    }
    @GetMapping("/cleaning-tasks")
    public ResponseEntity<?> getCleaningTasks(
            @RequestParam(required = false) String shift,
            @RequestParam(required = false) Integer floor
    ) {
        try {
            // Log ra console xem React có truyền gì lên không
            System.out.println("React gọi API với Shift: " + shift + ", Floor: " + floor);

            return ResponseEntity.ok(
                    roomService.getCleaningTasks(shift, floor)
            );
        } catch (Exception e) {
            // Dòng này cực kỳ quan trọng, nó sẽ in lỗi màu đỏ chi tiết tại Console IntelliJ/Eclipse để bạn sửa code Service
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi xử lý tại RoomService: " + e.getMessage());
        }
    }
    @PostMapping("/rooms/{roomNumber}/status")
    public ResponseEntity<UpdateRoomStatusResponse> updateRoomStatus(
            @PathVariable String roomNumber,
            @Valid @RequestBody UpdateRoomStatusRequest request
    ) {

        return ResponseEntity.ok(
                roomService.updateRoomStatus(
                        roomNumber,
                        request
                )
        );
    }

    @PostMapping("/rooms/{roomNumber}/accept-cleaning")
    public ResponseEntity<AcceptCleaningTaskResponse> acceptCleaningTask(
            @PathVariable String roomNumber) {

        return ResponseEntity.ok(
                roomService.acceptCleaningTask(roomNumber)
        );
    }
    @PostMapping("/incidents/report-furniture")
    public ResponseEntity<?> reportFurnitureIncident(
            @Valid @RequestBody CreateIncidentRequest request
    ) {
        return ResponseEntity.ok(
                roomService.createFurnitureIncident(request)
        );
    }
}