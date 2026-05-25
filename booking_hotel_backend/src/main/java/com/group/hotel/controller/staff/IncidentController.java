package com.group.hotel.controller.staff;

import com.group.hotel.dto.response.FurnitureItemResponse;
import com.group.hotel.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping("/rooms/{roomNumber}/furniture")
    public List<FurnitureItemResponse> getFurnitureByRoom(
            @PathVariable String roomNumber
    ) {

        return incidentService.getFurnitureByRoom(roomNumber);
    }
}