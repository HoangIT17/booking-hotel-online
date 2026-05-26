package com.group.hotel.room.service.impl;

import com.group.hotel.room.dto.request.RoomCreateRequest;
import com.group.hotel.room.dto.request.RoomSearchRequest;
import com.group.hotel.room.dto.request.RoomUpdateRequest;
import com.group.hotel.room.dto.response.RoomResponse;
import com.group.hotel.room.entity.Room;
import com.group.hotel.room.entity.RoomType;
import com.group.hotel.common.exception.RoomConflictException;
import com.group.hotel.common.exception.RoomNotFoundException;
import com.group.hotel.common.exception.RoomTypeNotFoundException;
import com.group.hotel.room.mapper.RoomMapper;
import com.group.hotel.room.repository.RoomRepository;
import com.group.hotel.room.repository.RoomTypeRepository;
import com.group.hotel.room.service.RoomService;
import com.group.hotel.enums.RoomStatus;
import com.group.hotel.room.specification.RoomSpecification;
import com.group.hotel.common.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final RoomTypeRepository roomTypeRepository;

    public RoomServiceImpl(RoomRepository roomRepository,
                           RoomMapper roomMapper,
                           RoomTypeRepository roomTypeRepository) {
        this.roomRepository = roomRepository;
        this.roomMapper = roomMapper;
        this.roomTypeRepository = roomTypeRepository;
    }

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
}
