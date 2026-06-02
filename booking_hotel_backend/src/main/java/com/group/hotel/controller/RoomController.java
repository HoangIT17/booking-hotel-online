package com.group.hotel.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.room.RoomCreateRequest;
import com.group.hotel.dto.request.room.RoomSearchRequest;
import com.group.hotel.dto.request.room.RoomUpdateRequest;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.response.room.RoomDetailResponse;
import com.group.hotel.dto.response.room.RoomResponse;
import com.group.hotel.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/api/v1/rooms/statuses")
    public ResponseEntity<BaseResponse<List<String>>> getStatuses() {
        return ResponseEntity.ok(BaseResponse.success(roomService.getStatuses()));
    }

    @GetMapping("/api/v1/rooms/room-type")
    public ResponseEntity<BaseResponse<List<String>>> getRoomTypes() {
        return ResponseEntity.ok(BaseResponse.success(roomService.getRoomTypes()));
    }

    @GetMapping("/api/v1/rooms")
    public ResponseEntity<BaseResponse<PageResponse<RoomResponse>>> getAll(
            @ModelAttribute RoomSearchRequest roomSearchRequest,
            @PageableDefault(sort = "roomNumber", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(BaseResponse.success(roomService.getAll(roomSearchRequest, pageable)));
    }

    @GetMapping("/api/v1/rooms/{id}")
    public ResponseEntity<BaseResponse<RoomDetailResponse>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(roomService.getDetail(id)));
    }

    @PostMapping("/api/v1/rooms")
    public ResponseEntity<BaseResponse<RoomResponse>> create(
            @Valid @RequestBody RoomCreateRequest roomCreateRequest) {
        return ResponseEntity.ok(BaseResponse.success(roomService.create(roomCreateRequest)));
    }

    @PutMapping("/api/v1/rooms/{id}")
    public ResponseEntity<BaseResponse<RoomResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody RoomUpdateRequest roomUpdateRequest) {
        return ResponseEntity.ok(BaseResponse.success(roomService.update(id, roomUpdateRequest)));
    }

    @DeleteMapping("/api/v1/rooms/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @PutMapping("/api/v1/rooms/{id}/restore")
    public ResponseEntity<BaseResponse<RoomResponse>> restore(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(roomService.restore(id)));
    }

    @PutMapping("/api/v1/rooms/{id}/furnitures")
    public ResponseEntity<BaseResponse<RoomDetailResponse>> updateFurnitures(
            @PathVariable Long id,
            @RequestBody List<Long> furnitureIds) {
        return ResponseEntity.ok(BaseResponse.success(roomService.updateFurnitures(id, furnitureIds)));
    }

    @PostMapping(value = "/api/v1/rooms/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(BaseResponse.success(roomService.uploadImage(id, file)));
    }
}