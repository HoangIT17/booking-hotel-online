package com.group.hotel.service.impl;

import com.group.hotel.dto.request.furniture.FurnitureCreateRequest;
import com.group.hotel.dto.request.furniture.FurnitureSearchRequest;
import com.group.hotel.dto.request.furniture.FurnitureUpdateRequest;
import com.group.hotel.dto.response.furniture.FurnitureResponse;
import com.group.hotel.entity.Furniture;
import com.group.hotel.exception.FurnitureConflictException;
import com.group.hotel.exception.FurnitureNotFoundException;
import com.group.hotel.mapper.FurnitureMapper;
import com.group.hotel.repository.FurnitureRepository;
import com.group.hotel.enums.FurnitureType;
import com.group.hotel.service.FurnitureService;
import com.group.hotel.specification.FurnitureSpecification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class FurnitureServiceImpl implements FurnitureService {
    private final FurnitureRepository furnitureRepository;
    private final FurnitureMapper furnitureMapper;

    public FurnitureServiceImpl(FurnitureRepository furnitureRepository,
                                FurnitureMapper furnitureMapper){
        this.furnitureRepository = furnitureRepository;
        this.furnitureMapper = furnitureMapper;
    }

    @Override
    public List<FurnitureResponse> getAll(FurnitureSearchRequest furnitureSearchRequest) {
        Specification<Furniture> spec = (root, query, builder) -> builder.conjunction();

        if (furnitureSearchRequest.getFurnitureType() != null && !furnitureSearchRequest.getFurnitureType().isBlank()) {
            spec = spec.and(FurnitureSpecification.hasFurnitureType(furnitureSearchRequest.getFurnitureType()));
        }
        if (furnitureSearchRequest.getFurnitureName() != null && !furnitureSearchRequest.getFurnitureName().isBlank()) {
            spec = spec.and(FurnitureSpecification.hasNameContaining(furnitureSearchRequest.getFurnitureName()));
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

        furnitureRepository.delete(furniture);
    }

    @Override
    public List<String> getTypes() {
        return Arrays.stream(FurnitureType.values())
                .map(Enum::name)
                .toList();
    }
}
