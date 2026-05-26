package com.group.hotel.room.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.room.dto.request.RoomTypeFurnitureRequest;
import com.group.hotel.room.dto.request.RoomTypeSearchRequest;
import com.group.hotel.room.dto.request.RoomTypeUpdateRequest;
import com.group.hotel.room.dto.response.RoomTypeDetailResponse;
import com.group.hotel.room.dto.response.RoomTypeResponse;
import com.group.hotel.room.service.RoomTypeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RoomTypeController {
    private final RoomTypeService roomTypeService;

    public RoomTypeController(RoomTypeService roomTypeService) {
        this.roomTypeService = roomTypeService;
    }

    @GetMapping("/api/admin/room-types")
    public ResponseEntity<BaseResponse<List<RoomTypeResponse>>> getAll(
            @ModelAttribute RoomTypeSearchRequest roomTypeSearchRequest) {
        return ResponseEntity.ok(BaseResponse.success(roomTypeService.getAll(roomTypeSearchRequest)));
    }

    @GetMapping("/api/admin/room-types/{id}")
    public ResponseEntity<BaseResponse<RoomTypeDetailResponse>> getRoomTypeById(
            @PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(roomTypeService.getRoomTypeById(id)));
    }

    @PutMapping("/api/admin/room-types/{id}")
    public ResponseEntity<BaseResponse<RoomTypeResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody RoomTypeUpdateRequest roomTypeUpdateRequest){
        return ResponseEntity.ok(BaseResponse.success(roomTypeService.update(id, roomTypeUpdateRequest)));
    }

    @PutMapping("/api/admin/room-types/{id}/furnitures")
    public ResponseEntity<BaseResponse<Void>> updateFurnitures(
            @PathVariable Long id,
            @RequestBody RoomTypeFurnitureRequest request) {
        roomTypeService.furnituresMapping(id, request);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @GetMapping("/api/admin/room-types/types")
    public ResponseEntity<BaseResponse<List<String>>> getTypes() {
        return ResponseEntity.ok(BaseResponse.success(roomTypeService.getTypes()));
    }
}