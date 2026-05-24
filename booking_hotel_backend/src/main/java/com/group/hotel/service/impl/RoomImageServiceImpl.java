package com.group.hotel.service.impl;

import com.group.hotel.dto.response.RoomImageResponse;
import com.group.hotel.entity.RoomImage;
import com.group.hotel.entity.RoomType;
import com.group.hotel.exception.RoomImageNotFoundException;
import com.group.hotel.exception.RoomTypeNotFoundException;
import com.group.hotel.repository.RoomImageRepository;
import com.group.hotel.repository.RoomTypeRepository;
import com.group.hotel.service.RoomImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomImageServiceImpl implements RoomImageService {

    private final RoomImageRepository roomImageRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    @Transactional
    public List<RoomImageResponse> uploadImages(Long roomTypeId, List<MultipartFile> files) {
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(RoomTypeNotFoundException::new);

        boolean hasThumbnail = roomImageRepository.findByRoomTypeIdAndIsThumbnailTrue(roomTypeId).isPresent();

        List<RoomImageResponse> result = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String filename = UUID.randomUUID() + getExtension(file.getOriginalFilename());
            Path dest = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);

            try {
                Files.createDirectories(dest.getParent());
                Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                log.error("Failed to save file {}: {}", filename, e.getMessage());
                throw new RuntimeException("Không thể lưu file ảnh, vui lòng thử lại!");
            }

            boolean isThumbnail = !hasThumbnail;
            RoomImage image = roomImageRepository.save(
                    new RoomImage(null, roomType, "/RoomImages/" + filename, isThumbnail)
            );

            if (isThumbnail) hasThumbnail = true;

            result.add(new RoomImageResponse(image.getId(), image.getImageUrl(), image.getIsThumbnail()));
        }

        return result;
    }

    @Override
    @Transactional
    public void deleteImage(Long roomTypeId, Long imageId) {
        RoomImage image = roomImageRepository.findById(imageId)
                .orElseThrow(RoomImageNotFoundException::new);

        if (!image.getRoomType().getId().equals(roomTypeId)) {
            throw new RoomImageNotFoundException();
        }

        String filename = Paths.get(image.getImageUrl()).getFileName().toString();
        Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Could not delete file {}: {}", filePath, e.getMessage());
        }

        roomImageRepository.delete(image);
    }

    @Override
    @Transactional
    public RoomImageResponse setThumbnail(Long roomTypeId, Long imageId) {
        roomImageRepository.findByRoomTypeIdAndIsThumbnailTrue(roomTypeId).ifPresent(current -> {
            current.setIsThumbnail(false);
            roomImageRepository.save(current);
        });

        RoomImage image = roomImageRepository.findById(imageId)
                .orElseThrow(RoomImageNotFoundException::new);

        if (!image.getRoomType().getId().equals(roomTypeId)) {
            throw new RoomImageNotFoundException();
        }

        image.setIsThumbnail(true);
        roomImageRepository.save(image);

        return new RoomImageResponse(image.getId(), image.getImageUrl(), image.getIsThumbnail());
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
