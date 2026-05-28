package com.group.hotel.service.impl;

import com.group.hotel.dto.request.RoomCreateRequest;
import com.group.hotel.dto.request.RoomSearchRequest;
import com.group.hotel.dto.request.RoomUpdateRequest;
import com.group.hotel.dto.response.RoomDetailResponse;
import com.group.hotel.dto.response.RoomResponse;
import com.group.hotel.entity.Room;
import com.group.hotel.enums.RoomTypeName;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.exception.RoomNotFoundException;
import com.group.hotel.entity.Furniture;
import com.group.hotel.mapper.RoomMapper;
import com.group.hotel.repository.FurnitureRepository;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.service.RoomService;
import com.group.hotel.enums.RoomStatus;
import com.group.hotel.specification.RoomSpecification;
import com.group.hotel.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final FurnitureRepository furnitureRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${server.port:8080}")
    private String serverPort;

    @Override
    public List<String> getStatuses() {
        return Arrays.stream(RoomStatus.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    public List<String> getRoomTypes() {
        return Arrays.stream(RoomTypeName.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    public PageResponse<RoomResponse> getAll(RoomSearchRequest roomSearchRequest, Pageable pageable) {
        Specification<Room> spec = (root, query, builder) -> builder.conjunction();

        if (roomSearchRequest.getRoomNumber() != null && !roomSearchRequest.getRoomNumber().isBlank()) {
            spec = spec.and(RoomSpecification.hasRoomNumber(roomSearchRequest.getRoomNumber()));
        }
        if (roomSearchRequest.getFloor() != null) {
            spec = spec.and(RoomSpecification.hasFloor(roomSearchRequest.getFloor()));
        }
        if (roomSearchRequest.getStatus() != null && !roomSearchRequest.getStatus().isBlank()) {
            spec = spec.and(RoomSpecification.hasStatus(roomSearchRequest.getStatus()));
        }
        if (roomSearchRequest.getRoomTypeName() != null && !roomSearchRequest.getRoomTypeName().isBlank()) {
            spec = spec.and(RoomSpecification.hasRoomType(roomSearchRequest.getRoomTypeName()));
        }
        if (roomSearchRequest.getIsDeleted() != null) {
            spec = spec.and(RoomSpecification.hasIsDeleted(roomSearchRequest.getIsDeleted()));
        }

        return PageResponse.of(roomRepository.findAll(spec, pageable).map(roomMapper::toResponse));
    }

    @Override
    public RoomDetailResponse getDetail(Long id) {
        Room room = roomRepository.findByIdWithFurnitures(id)
                .orElseThrow(() -> new RoomNotFoundException());
        return roomMapper.toDetailResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse create(RoomCreateRequest roomCreateRequest) {
        String floorStr  = String.valueOf(roomCreateRequest.getFloor());
        String roomNumber = roomCreateRequest.getRoomNumber();

        int expectedPrefixLen = roomNumber.length() - 2;
        if (expectedPrefixLen <= 0
                || expectedPrefixLen != floorStr.length()
                || !roomNumber.substring(0, expectedPrefixLen).equals(floorStr)) {
            throw new RoomConflictException("Số phòng phải bắt đầu bằng số tầng (vd: tầng 1 → 101, tầng 10 → 1001, tầng 12 → 1201)");
        }
        if (roomRepository.existsByRoomNumberAndFloor(roomCreateRequest.getRoomNumber(), roomCreateRequest.getFloor())) {
            throw new RoomConflictException("Số phòng đã tồn tại");
        }

        Room room = roomMapper.fromCreate(roomCreateRequest);

        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public RoomResponse update(Long id, RoomUpdateRequest roomUpdateRequest) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException());

        room.setRoomType(RoomTypeName.valueOf(roomUpdateRequest.getRoomType()));
        roomMapper.fromUpdate(roomUpdateRequest, room);

        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException());

        if (room.getStatus() == RoomStatus.OCCUPIED) {
            throw new RoomConflictException("Không thể xóa phòng đang được sử dụng");
        }

        room.setDeleted(true);
        roomRepository.save(room);
    }

    @Override
    @Transactional
    public RoomResponse restore(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException());

        if (!room.isDeleted()) {
            throw new RoomConflictException("Phòng này chưa bị xóa");
        }

        room.setDeleted(false);
        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public RoomDetailResponse updateFurnitures(Long id, List<Long> furnitureIds) {
        Room room = roomRepository.findByIdWithFurnitures(id)
                .orElseThrow(() -> new RoomNotFoundException());

        List<Furniture> furnitures = furnitureIds == null || furnitureIds.isEmpty()
                ? new java.util.ArrayList<>()
                : furnitureRepository.findAllById(furnitureIds);

        room.setFurnitures(furnitures);
        return roomMapper.toDetailResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public String uploadImage(Long id, MultipartFile file) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException());

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.contains(".")) {
                throw new RoomConflictException("File ảnh không hợp lệ");
            }
            String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID() + ext;

            Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "http://localhost:" + serverPort + "/RoomImages/" + filename;
            room.setImageUrl(imageUrl);
            roomRepository.save(room);
            return imageUrl;
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu ảnh: " + e.getMessage());
        }
    }
}
