package com.group.hotel.controller.manager;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.RoomCreateRequest;
import com.group.hotel.dto.request.RoomSearchRequest;
import com.group.hotel.dto.request.RoomUpdateRequest;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.response.RoomResponse;
import com.group.hotel.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/api/manager/rooms/statuses")
    public ResponseEntity<BaseResponse<List<String>>> getStatuses() {
        return ResponseEntity.ok(BaseResponse.success(roomService.getStatuses()));
    }

    @GetMapping("/api/manager/rooms")
    public ResponseEntity<BaseResponse<PageResponse<RoomResponse>>> getAll(
            @ModelAttribute RoomSearchRequest roomSearchRequest,
            @PageableDefault(size = 10, sort = "roomNumber", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(roomService.getAll(roomSearchRequest, pageable)));
    }

    @PostMapping("/api/manager/rooms")
    public ResponseEntity<BaseResponse<RoomResponse>> create(
            @RequestBody RoomCreateRequest roomCreateRequest) {
        return ResponseEntity.ok(BaseResponse.success(roomService.create(roomCreateRequest)));
    }

    @PutMapping("/api/manager/rooms/{id}")
    public ResponseEntity<BaseResponse<RoomResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody RoomUpdateRequest roomUpdateRequest) {
        return ResponseEntity.ok(BaseResponse.success(roomService.update(id, roomUpdateRequest)));
    }

    @DeleteMapping("/api/manager/rooms/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @PutMapping("/api/manager/rooms/{id}/restore")
    public ResponseEntity<BaseResponse<RoomResponse>> restore(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(roomService.restore(id)));
    }
}
