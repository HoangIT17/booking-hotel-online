package com.group.hotel.controller.admin;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.dto.request.FurnitureCreateRequest;
import com.group.hotel.dto.request.FurnitureSearchRequest;
import com.group.hotel.dto.request.FurnitureUpdateRequest;
import com.group.hotel.dto.response.FurnitureResponse;
import com.group.hotel.service.FurnitureService;
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


    @GetMapping("/api/v1/admin/furnitures/types")
    public ResponseEntity<BaseResponse<List<String>>> getTypes() {
        return ResponseEntity.ok(BaseResponse.success(furnitureService.getTypes()));
    }

    @GetMapping("/api/v1/admin/furnitures")
    public ResponseEntity<BaseResponse<List<FurnitureResponse>>> getAll(
            @ModelAttribute FurnitureSearchRequest furnitureSearchRequest){
        return ResponseEntity.ok(BaseResponse.success(furnitureService.getAll(furnitureSearchRequest)));
    }

    @PostMapping("/api/v1/admin/furnitures")
    public ResponseEntity<BaseResponse<FurnitureResponse>> create(
            @Valid @RequestBody FurnitureCreateRequest furnitureCreateRequest){
        return ResponseEntity.ok(BaseResponse.success(furnitureService.create(furnitureCreateRequest)));
    }

    @PutMapping("/api/v1/admin/furnitures/{id}")
    public ResponseEntity<BaseResponse<FurnitureResponse>> update(
            @PathVariable Long id, @Valid @RequestBody FurnitureUpdateRequest furnitureUpdateRequest){
        return ResponseEntity.ok(BaseResponse.success(furnitureService.update(id, furnitureUpdateRequest)));
    }

    @DeleteMapping("/api/v1/admin/furnitures/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(@PathVariable Long id){
        furnitureService.delete(id);
        return ResponseEntity.ok(BaseResponse.success(null));
    }
}
