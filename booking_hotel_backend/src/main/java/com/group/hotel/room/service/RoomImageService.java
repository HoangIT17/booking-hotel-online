package com.group.hotel.room.service;

import com.group.hotel.room.dto.response.RoomImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RoomImageService {
    List<RoomImageResponse> uploadImages(Long roomTypeId, List<MultipartFile> files);
    void deleteImage(Long roomTypeId, Long imageId);
    RoomImageResponse setThumbnail(Long roomTypeId, Long imageId);
}
