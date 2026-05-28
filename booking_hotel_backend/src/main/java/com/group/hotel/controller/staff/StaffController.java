package com.group.hotel.controller.staff;

import com.group.hotel.dto.request.CreateMaintenanceRequest;
import com.group.hotel.dto.response.MaintenanceResponse;
import com.group.hotel.dto.response.RoomDetailResponse;
import com.group.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}