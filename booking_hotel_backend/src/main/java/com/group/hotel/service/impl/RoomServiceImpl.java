package com.group.hotel.service.impl;

import com.group.hotel.dto.request.MaintenanceRequest;
import com.group.hotel.dto.request.RoomCreateRequest;
import com.group.hotel.dto.request.RoomSearchRequest;
import com.group.hotel.dto.request.RoomUpdateRequest;
import com.group.hotel.dto.response.*;
import com.group.hotel.entity.*;
import com.group.hotel.enums.IncidentStatus;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.exception.RoomNotFoundException;
import com.group.hotel.exception.RoomTypeNotFoundException;
import com.group.hotel.mapper.RoomMapper;
import com.group.hotel.repository.*;
import com.group.hotel.service.RoomService;
import com.group.hotel.enums.RoomStatus;
import com.group.hotel.specification.RoomSpecification;
import com.group.hotel.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomTypeFurnitureRepository roomTypeFurnitureRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;

//    public RoomServiceImpl(RoomRepository roomRepository,
//                           RoomMapper roomMapper,
//                           RoomTypeRepository roomTypeRepository, RoomTypeFurnitureRepository roomTypeFurnitureRepository, IncidentRepository incidentRepository) {
//        this.roomRepository = roomRepository;
//        this.roomMapper = roomMapper;
//        this.roomTypeRepository = roomTypeRepository;
//        this.roomTypeFurnitureRepository = roomTypeFurnitureRepository;
//        this.incidentRepository = incidentRepository;
//    }

    @Override
    public List<String> getStatuses() {
        return Arrays.stream(RoomStatus.values())
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
        if (roomSearchRequest.getRoomTypeId() != null) {
            spec = spec.and(RoomSpecification.hasRoomTypeId(roomSearchRequest.getRoomTypeId()));
        }
        if (roomSearchRequest.getIsDeleted() != null) {
            spec = spec.and(RoomSpecification.hasIsDeleted(roomSearchRequest.getIsDeleted()));
        }

        return PageResponse.of(roomRepository.findAll(spec, pageable).map(roomMapper::toResponse));
    }

    @Override
    @Transactional
    public RoomResponse create(RoomCreateRequest roomCreateRequest) {
        RoomType roomType = roomTypeRepository.findById(roomCreateRequest.getRoomTypeId())
                .orElseThrow(() -> new RoomTypeNotFoundException());

        if (!roomCreateRequest.getRoomNumber().startsWith(String.valueOf(roomCreateRequest.getFloor()))) {
            throw new RoomConflictException("Số phòng phải bắt đầu bằng số tầng (vd: tầng 1 → 101, tầng 12 → 1201)");
        }

        if (roomRepository.existsByRoomNumberAndFloor(roomCreateRequest.getRoomNumber(), roomCreateRequest.getFloor())) {
            throw new RoomConflictException("Số phòng đã tồn tại");
        }

        Room room = roomMapper.fromCreate(roomCreateRequest);
        room.setRoomType(roomType);

        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public RoomResponse update(Long id, RoomUpdateRequest roomUpdateRequest) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException());

        room.setRoomType(roomTypeRepository.findById(roomUpdateRequest.getRoomTypeId())
                .orElseThrow(() -> new RoomTypeNotFoundException()));

        roomMapper.fromUpdate(roomUpdateRequest, room);

        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(RoomNotFoundException::new);

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
                .orElseThrow(RoomNotFoundException::new);

        if (!room.isDeleted()) {
            throw new RoomConflictException("Phòng này chưa bị xóa");
        }

        room.setDeleted(false);
        return roomMapper.toResponse(roomRepository.save(room));
    }

    @Override
    public RoomTypeDetailResponse getRoomTypeDetail(String roomNumber) {

        // 1. Validate input
        if (roomNumber == null || roomNumber.isBlank()) {
            throw new RoomConflictException("Số phòng không được phép để trống");
        }

        // 2. Get room
        Room room = (Room) roomRepository
                .findByRoomNumberAndIsDeletedFalse(roomNumber)
                .orElseThrow(RoomNotFoundException::new);

        // 3. Get furniture list by room type
        List<RoomTypeFurniture> roomFurnitures =
                roomTypeFurnitureRepository.findByRoomType(room.getRoomType());

        List<FurnitureItemResponse> furnitureResponses = roomFurnitures.stream()
                .map((RoomTypeFurniture item) -> {

                    var furniture = item.getFurniture();

                    String type = (furniture.getFurnitureType() != null)
                            ? furniture.getFurnitureType().name()
                            : "UNKNOWN";

                    String desc = (furniture.getDescription() != null)
                            ? furniture.getDescription()
                            : "";

                    return FurnitureItemResponse.builder()
                            .furnitureId(furniture.getId())
                            .furnitureName(furniture.getFurnitureName())
                            .furnitureType(type)
                            .quantity(item.getQuantity())
                            .description(desc)
                            .incidentStatus(null)
                            .build();
                })
                .toList();

        // 4. Get incident history (null-safe + type-safe)
        List<IncidentHistoryResponse> incidentResponses =
                incidentRepository
                        .findByRoom_IdOrderByCreatedAtDesc(room.getId())
                        .stream()
                        .map((com.group.hotel.entity.Incident incident) ->
                                IncidentHistoryResponse.builder()
                                        .id(incident.getId())
                                        .description(incident.getDescription())
                                        .status(incident.getStatus() != null
                                                ? incident.getStatus().name()
                                                : null)
                                        .createdAt(incident.getCreatedAt())
                                        .build()
                        )
                        .toList();

        // 5. Return response
        return RoomTypeDetailResponse.builder()
                .id(room.getRoomType().getId())
                .typeName(String.valueOf(room.getRoomType().getTypeName()))
                .basePrice(room.getRoomType().getBasePrice())
                .area(room.getRoomType().getArea())
                .maxPeople(room.getRoomType().getMaxPeople())
                .description(room.getRoomType().getDescription())
                .incidentHistory(incidentResponses)
                .createdAt(room.getRoomType().getCreatedAt())
                .updatedAt(room.getRoomType().getUpdatedAt())
                .build();
    }

    @Override
    public MaintenanceResponse createMaintenanceRequest(MaintenanceRequest request, Long staffId) {

        Room room = roomRepository.findByRoomNumber(request.getRoomNumber())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // TODO: upload image (AWS/S3/local)
        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = request.getImage().getOriginalFilename();
        }

        Incident incident = new Incident();
        incident.setRoom(room);        // ✅ FIX
        incident.setStaff(staff);      // ✅ FIX
        incident.setDescription(request.getIncidentDescription());
        incident.setStatus(IncidentStatus.PENDING);

        incidentRepository.save(incident);

        MaintenanceResponse response = new MaintenanceResponse();
        response.setTicketId("MT-" + incident.getId());
        response.setStatus(incident.getStatus().name());

        return response;
    }
}
