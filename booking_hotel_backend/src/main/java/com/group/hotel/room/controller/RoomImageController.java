package com.group.hotel.room.controller;

import com.group.hotel.common.response.BaseResponse;
import com.group.hotel.room.dto.response.RoomImageResponse;
import com.group.hotel.room.service.RoomImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoomImageController {

    private final RoomImageService roomImageService;

    @PostMapping(value = "/api/admin/room-types/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<List<RoomImageResponse>>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(BaseResponse.success(roomImageService.uploadImages(id, files)));
    }

    @DeleteMapping("/api/admin/room-types/{id}/images/{imageId}")
    public ResponseEntity<BaseResponse<Void>> deleteImage(
            @PathVariable Long id,
            @PathVariable Long imageId) {
        roomImageService.deleteImage(id, imageId);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @PutMapping("/api/admin/room-types/{id}/images/{imageId}/thumbnail")
    public ResponseEntity<BaseResponse<RoomImageResponse>> setThumbnail(
            @PathVariable Long id,
            @PathVariable Long imageId) {
        return ResponseEntity.ok(BaseResponse.success(roomImageService.setThumbnail(id, imageId)));
    }
}
