package com.group.hotel.room.service.impl;

import com.group.hotel.room.dto.request.FurnitureCreateRequest;
import com.group.hotel.room.dto.request.FurnitureSearchRequest;
import com.group.hotel.room.dto.request.FurnitureUpdateRequest;
import com.group.hotel.room.dto.response.FurnitureResponse;
import com.group.hotel.room.entity.Furniture;
import com.group.hotel.common.exception.FurnitureConflictException;
import com.group.hotel.common.exception.FurnitureNotFoundException;
import com.group.hotel.room.mapper.FurnitureMapper;
import com.group.hotel.room.repository.FurnitureRepository;
import com.group.hotel.room.repository.RoomTypeFurnitureRepository;
import com.group.hotel.enums.FurnitureType;
import com.group.hotel.room.service.FurnitureService;
import com.group.hotel.room.specification.FurnitureSpecification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class FurnitureServiceImpl implements FurnitureService {
    private final FurnitureRepository furnitureRepository;
    private final FurnitureMapper furnitureMapper;
    private final RoomTypeFurnitureRepository roomTypeFurnitureRepository;

    public FurnitureServiceImpl(FurnitureRepository furnitureRepository,
                                FurnitureMapper furnitureMapper,
                                RoomTypeFurnitureRepository roomTypeFurnitureRepository){
        this.furnitureRepository = furnitureRepository;
        this.furnitureMapper = furnitureMapper;
        this.roomTypeFurnitureRepository = roomTypeFurnitureRepository;
    }

    @Override
    public List<FurnitureResponse> getAll(FurnitureSearchRequest furnitureSearchRequest) {
        Specification<Furniture> spec = (root, query, builder) -> builder.conjunction();

        if(furnitureSearchRequest.getFurnitureType() != null && !furnitureSearchRequest.getFurnitureType().isBlank()){
            spec = spec.and(FurnitureSpecification.hasFurnitureType(furnitureSearchRequest.getFurnitureType()));
        }

        List<Furniture> furnitures = furnitureRepository.findAll(spec);

        return furnitures.stream().map(furnitureMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public FurnitureResponse create(FurnitureCreateRequest furnitureCreateRequest) {
        if(furnitureRepository.existsByFurnitureNameIgnoreCase(furnitureCreateRequest.getFurnitureName())){
            throw new FurnitureConflictException("Nội thất đã tồn tại");
        }

        Furniture furniture = furnitureRepository.save(furnitureMapper.fromCreate(furnitureCreateRequest));

        return furnitureMapper.toResponse(furniture);
    }

    @Override
    @Transactional
    public FurnitureResponse update(Long id, FurnitureUpdateRequest furnitureUpdateRequest) {
        Furniture furniture = furnitureRepository.findById(id)
                .orElseThrow(() -> new FurnitureNotFoundException());

        furnitureMapper.fromUpdate(furnitureUpdateRequest, furniture);

        return furnitureMapper.toResponse(furnitureRepository.save(furniture));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Furniture furniture = furnitureRepository.findById(id)
                .orElseThrow(() -> new FurnitureNotFoundException());

        if(roomTypeFurnitureRepository.existsByFurnitureId(id)){
            throw new FurnitureConflictException("Không thể xóa - nội thất đang được sử dụng");
        }

        furnitureRepository.delete(furniture);
    }

    @Override
    public List<String> getTypes() {
        return Arrays.stream(FurnitureType.values())
                .map(Enum::name)
                .toList();
    }
}
