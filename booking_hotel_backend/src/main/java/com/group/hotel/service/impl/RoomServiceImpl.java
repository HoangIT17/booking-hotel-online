package com.group.hotel.service.impl;

import com.group.hotel.dto.request.*;
import com.group.hotel.dto.response.*;
import com.group.hotel.entity.Incident;
import com.group.hotel.entity.Room;
import com.group.hotel.entity.User;
import com.group.hotel.enums.IncidentStatus;
import com.group.hotel.enums.IncidentType;
import com.group.hotel.repository.IncidentRepository;
import com.group.hotel.enums.RoomTypeName;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.exception.RoomNotFoundException;
import com.group.hotel.entity.Furniture;
import com.group.hotel.mapper.RoomMapper;
import com.group.hotel.repository.FurnitureRepository;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.security.UserPrincipal;
import com.group.hotel.service.RoomService;
import com.group.hotel.enums.RoomStatus;
import com.group.hotel.specification.RoomSpecification;
import com.group.hotel.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final FurnitureRepository furnitureRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;

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

    @Override
    public RoomDetailResponse getRoomDetail(String roomNumber) {

        Room room = roomRepository
                .findByRoomNumberAndIsDeletedFalse(roomNumber)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        List<RoomFurnitureResponse> furnitureResponses =
                room.getFurnitures()
                        .stream()
                        .map(item -> RoomFurnitureResponse.builder()
                                .id(item.getId())
                                .furnitureName(item.getFurnitureName())
                                .furnitureType(item.getFurnitureType().name())
                                .status(getFurnitureStatus(item.getId()))
                                .build())
                        .toList();

        List<IncidentHistoryResponse> incidentResponses =
                incidentRepository
                        .findByRoomIdOrderByCreatedAtDesc(room.getId())
                        .stream()
                        .map(incident -> IncidentHistoryResponse.builder()
                                .id(incident.getId())
                                .description(incident.getDescription())
                                .status(incident.getStatus().name())
                                .reportedBy(incident.getStaff().getUsername())
                                .createdAt(incident.getCreatedAt())
                                .build())
                        .toList();

        return RoomDetailResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType().name())
                .floor(room.getFloor())
                .price(room.getPrice())
                .area(room.getArea())
                .maxPeople(room.getMaxPeople())
                .imageUrl(room.getImageUrl())
                .status(room.getStatus().name())
                .description(room.getDescription())
                .furnitures(furnitureResponses)
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .isDeleted(room.isDeleted())

                .incidentHistory(incidentResponses)
                .build();
    }
    private String getFurnitureStatus(Long furnitureId) {

        if (furnitureId % 3 == 0) {
            return "FIXING";
        }

        if (furnitureId % 2 == 0) {
            return "PENDING";
        }

        return "FIXED";
    }
    @Override
    public MaintenanceResponse createMaintenanceRequest(
            CreateMaintenanceRequest request
    ) {

        Room room = roomRepository
                .findByRoomNumberAndIsDeletedFalse(
                        request.getRoomNumber()
                )
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        Furniture furniture = furnitureRepository
                .findById(request.getFurnitureItemId())
                .orElseThrow(() ->
                        new RuntimeException("Furniture not found"));

        UserPrincipal userPrincipal =
                (UserPrincipal) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User staff = userRepository
                .findById(userPrincipal.getId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Incident incident = Incident.builder()
                .room(room)
                .staff(staff)
                //.furniture(furniture)
                .description(request.getIncidentDescription())
                .status(IncidentStatus.PENDING)
                .build();

        Incident savedIncident =
                incidentRepository.save(incident);

        return MaintenanceResponse.builder()
                .ticketId("MT-" + savedIncident.getId())
                .status(savedIncident.getStatus().name())
                .build();
    }

    @Override
    public List<CleaningTaskResponse> getCleaningTasks(
            String shift,
            Integer floor
    ) {

        List<Room> rooms;

        // Ví dụ:
        // READY = đã dọn
        // DIRTY = cần dọn
        // CLEANING = đang dọn

        if (floor != null) {
            rooms = roomRepository
                    .findByFloorAndIsDeletedFalse(floor);
        } else {
            rooms = roomRepository
                    .findByIsDeletedFalse();
        }

        return rooms.stream()

                // chỉ lấy phòng cần dọn
//                .filter(room ->
//                        room.getStatus().name().equals("DIRTY")
//                                || room.getStatus().name().equals("CLEANING")
//                )

                .map(room -> CleaningTaskResponse.builder()
                        .roomNumber(room.getRoomNumber())
                        .floor(room.getFloor())
                        .cleaningStatus(room.getStatus().name())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public UpdateRoomStatusResponse updateRoomStatus(
            String roomNumber,
            UpdateRoomStatusRequest request
    ) {

        Room room = roomRepository
                .findByRoomNumberAndIsDeletedFalse(roomNumber)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        if (!"READY".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException(
                    "Status must be READY");
        }

        // Không cho chuyển nếu đang có khách
        if (room.getStatus() == RoomStatus.OCCUPIED) {
            throw new RuntimeException(
                    "Room is occupied");
        }

        room.setStatus(RoomStatus.READY);

        roomRepository.save(room);

        return UpdateRoomStatusResponse.builder()
                .success(true)
                .message("Room status updated to READY successfully")
                .build();
    }

    @Override
    @Transactional
    public AcceptCleaningTaskResponse acceptCleaningTask(String roomNumber) {

        Room room = roomRepository
                .findByRoomNumberAndIsDeletedFalse(roomNumber)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng: " + roomNumber));

        if (room.getStatus() != RoomStatus.DIRTY) {
            throw new RuntimeException("Chỉ có phòng trạng thái BẨN (DIRTY) mới có thể nhận dọn dẹp!");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra an toàn trước khi ép kiểu tránh lỗi 500
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new RuntimeException("Phiên đăng nhập không hợp lệ hoặc bạn không có quyền nhân viên!");
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User staff = userRepository
                .findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tài khoản nhân viên dọn dẹp"));

        // Chuyển trạng thái phòng sang CLEANING (Đang dọn)
        room.setStatus(RoomStatus.CLEANING);
        roomRepository.save(room);

        return AcceptCleaningTaskResponse.builder()
                .success(true)
                .roomNumber(room.getRoomNumber())
                .cleaningStatus(room.getStatus().name())
                .assignedStaff(staff.getUsername())
                .message("Nhận dọn dẹp phòng thành công!")
                .build();
    }

    @Override
    @Transactional
    public Map<String, Object> createFurnitureIncident(CreateIncidentRequest request) {
        // 1. Tìm phòng theo số phòng
        Room room = roomRepository
                .findByRoomNumberAndIsDeletedFalse(request.getRoomNumber())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng tương ứng"));

        // 2. Tìm thiết bị nội thất theo ID
        Furniture furniture = furnitureRepository
                .findById(request.getFurnitureItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị này"));

        // 3. Lấy thông tin nhân viên từ Security Context
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User staff = userRepository
                .findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Tài khoản nhân viên không tồn tại"));

        // 4. Tạo và lưu thực thể Incident mới (Đã nâng cấp theo cách 1)
        Incident incident = Incident.builder()
                .room(room)
                .staff(staff)
                .furniture(furniture) // Gán thiết bị hỏng/mất
                .incidentType(IncidentType.valueOf(request.getIncidentType().toUpperCase())) // DAMAGED hoặc MISSING
                .description(request.getDescription())
                .status(IncidentStatus.PENDING) // Đợi kỹ thuật xử lý
                .build();

        Incident savedIncident = incidentRepository.save(incident);

        // 5. Cập nhật trực tiếp trạng thái thiết bị nội thất trong phòng
        // (Giúp đồng bộ dữ liệu hiển thị trên giao diện danh sách tiện nghi)
        if (incident.getIncidentType() == IncidentType.DAMAGED) {
            furniture.setStatus("DAMAGED"); // Hoặc trạng thái tương ứng trong Enum Furniture của bạn
        } else if (incident.getIncidentType() == IncidentType.MISSING) {
            furniture.setStatus("MISSING");
        }
        furnitureRepository.save(furniture);

        // 6. Trả về Response Map đồng bộ với cấu trúc kiểm tra success của Frontend
        return Map.of(
                "success", true,
                "message", "Báo cáo sự cố thiết bị thành công!",
                "ticketId", "INC-" + savedIncident.getId(),
                "status", savedIncident.getStatus().name()
        );
    }

}
