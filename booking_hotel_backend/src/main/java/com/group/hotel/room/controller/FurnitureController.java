package com.group.hotel.room.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.room.dto.request.FurnitureCreateRequest;
import com.group.hotel.room.dto.request.FurnitureSearchRequest;
import com.group.hotel.room.dto.request.FurnitureUpdateRequest;
import com.group.hotel.room.dto.response.FurnitureResponse;
import com.group.hotel.room.service.FurnitureService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FurnitureController {
    private final FurnitureService furnitureService;

    public FurnitureController(FurnitureService furnitureService){
        this.furnitureService = furnitureService;
    }

    @GetMapping("/api/admin/furnitures")
    public ResponseEntity<BaseResponse<List<FurnitureResponse>>> getAll(
            @ModelAttribute FurnitureSearchRequest furnitureSearchRequest){
        return ResponseEntity.ok(BaseResponse.success(furnitureService.getAll(furnitureSearchRequest)));
    }

    @PostMapping("/api/admin/furnitures")
    public ResponseEntity<BaseResponse<FurnitureResponse>> create(
            @Valid @RequestBody FurnitureCreateRequest furnitureCreateRequest){
        return ResponseEntity.ok(BaseResponse.success(furnitureService.create(furnitureCreateRequest)));
    }

    @PutMapping("/api/admin/furnitures/{id}")
    public ResponseEntity<BaseResponse<FurnitureResponse>> update(
            @PathVariable Long id, @Valid @RequestBody FurnitureUpdateRequest furnitureUpdateRequest){
        return ResponseEntity.ok(BaseResponse.success(furnitureService.update(id, furnitureUpdateRequest)));
    }

    @DeleteMapping("/api/admin/furnitures/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id){
        furnitureService.delete(id);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @GetMapping("/api/admin/furnitures/types")
    public ResponseEntity<BaseResponse<List<String>>> getTypes() {
        return ResponseEntity.ok(BaseResponse.success(furnitureService.getTypes()));
    }
}
