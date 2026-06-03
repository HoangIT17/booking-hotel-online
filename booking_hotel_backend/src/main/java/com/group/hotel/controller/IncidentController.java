package com.group.hotel.controller;

import com.group.hotel.dto.request.incident.IncidentDecisionRequest;
import com.group.hotel.dto.request.incident.ResolveRequest;
import com.group.hotel.dto.response.ApiResponse;
import com.group.hotel.dto.response.incident.IncidentDetailResponse;
import com.group.hotel.dto.response.incident.IncidentListResponse;
import com.group.hotel.dto.response.incident.IncidentReport;
import com.group.hotel.dto.response.incident.IncidentResponse;
import com.group.hotel.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Đảm bảo không bị block CORS khi gọi từ FrontEnd
public class IncidentController {

    private final IncidentService incidentService; // Đã xóa bớt 1 dấu chấm phẩy thừa (;;)

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<IncidentListResponse>> getListIncidents(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long roomId,
            @RequestParam(required = false) Long staffId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        IncidentListResponse data = incidentService.getListIncidents(
                status, type, priority, roomId, staffId, fromDate, toDate, sortBy, direction, page, size
        );

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/{id}")
    // 🛠️ ĐA SỬA: Chuyển từ hasRole('MANAGER') sang hasAnyAuthority để đồng bộ hoàn toàn với SecurityConfig của bạn
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<IncidentDetailResponse>> getIncidentById(@PathVariable("id") Long id) {

        IncidentDetailResponse detailData = incidentService.getIncidentById(id);

        // 🛠️ ĐÃ SỬA: Bọc data qua ApiResponse.success() đúng chuẩn framework chung của dự án bạn
        return ResponseEntity.ok(ApiResponse.success(detailData));
    }

    @PutMapping("/{id}/decision")
    @PreAuthorize("hasAnyAuthority('MANAGER')") // Đảm bảo đúng role
    public ResponseEntity<ApiResponse<IncidentDetailResponse>> decideOnIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentDecisionRequest request) {

        IncidentDetailResponse result = incidentService.decideOnIncident(id, request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<?> resolveIncident(
            @PathVariable Long id,
            @RequestBody ResolveRequest request) {

        // Gọi service để thực thi logic
        IncidentResponse response = incidentService.resolveIncident(id, request);
        return ResponseEntity.ok(new ApiResponse(true, response));
    }
    @GetMapping("/reports/damaged-lost")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<IncidentReport>>> getDamagedLostReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(incidentService.getDamagedOrLostReport(pageable)));
    }
}