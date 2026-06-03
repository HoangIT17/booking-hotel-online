package com.group.hotel.controller;

import com.group.hotel.service.HousekeepingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class CleaningController {
    @Autowired
    private HousekeepingService housekeepingService;

    @PostMapping("/receptionist/rooms/{roomNumber}/create-cleaning")
    public ResponseEntity<String> requestCleaning(
            @PathVariable String roomNumber,
            @RequestBody(required = false) Map<String, String> body) { // Dùng Map để an toàn

        String note = (body != null) ? body.get("note") : null;
        housekeepingService.createCleaningRequest(roomNumber, note);
        return ResponseEntity.ok("Đã tạo yêu cầu dọn dẹp thành công.");
    }
}