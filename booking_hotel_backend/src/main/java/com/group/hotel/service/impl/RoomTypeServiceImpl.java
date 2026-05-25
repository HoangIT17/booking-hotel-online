package com.group.hotel.service.impl;

import com.group.hotel.dto.request.RoomTypeFurnitureRequest;
import com.group.hotel.dto.request.RoomTypeSearchRequest;
import com.group.hotel.dto.request.RoomTypeUpdateRequest;
import com.group.hotel.dto.response.FurnitureInRoomTypeResponse;
import com.group.hotel.dto.response.RoomImageResponse;
import com.group.hotel.dto.response.RoomTypeDetailResponse;
import com.group.hotel.dto.response.RoomTypeResponse;
import com.group.hotel.entity.Furniture;
import com.group.hotel.entity.RoomType;
import com.group.hotel.entity.RoomTypeFurniture;
import com.group.hotel.exception.RoomTypeNotFoundException;
import com.group.hotel.mapper.RoomTypeMapper;
import com.group.hotel.repository.FurnitureRepository;
import com.group.hotel.repository.RoomImageRepository;
import com.group.hotel.repository.RoomTypeFurnitureRepository;
import com.group.hotel.repository.RoomTypeRepository;
import com.group.hotel.enums.RoomTypeName;
import com.group.hotel.service.RoomTypeService;
import com.group.hotel.specification.RoomTypeSpecification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {
    private final RoomTypeRepository roomTypeRepository;
    private final RoomTypeMapper roomTypeMapper;
    private final RoomImageRepository roomImageRepository;
    private final RoomTypeFurnitureRepository roomTypeFurnitureRepository;
    private final FurnitureRepository furnitureRepository;

    public RoomTypeServiceImpl(RoomTypeRepository roomTypeRepository,
                               RoomTypeMapper roomTypeMapper,
                               RoomImageRepository roomImageRepository,
                               RoomTypeFurnitureRepository roomTypeFurnitureRepository,
                               FurnitureRepository furnitureRepository){
        this.roomTypeRepository = roomTypeRepository;
        this.roomTypeMapper = roomTypeMapper;
        this.roomImageRepository = roomImageRepository;
        this.roomTypeFurnitureRepository = roomTypeFurnitureRepository;
        this.furnitureRepository = furnitureRepository;
    }

    @Override
    public List<RoomTypeResponse> getAll(RoomTypeSearchRequest roomTypeSearchRequest) {
        Specification<RoomType> spec = (root, query, builder) -> builder.conjunction();

        if(roomTypeSearchRequest.getTypeName() != null && !roomTypeSearchRequest.getTypeName().isBlank()){
            spec = spec.and(RoomTypeSpecification.hasTypeName(roomTypeSearchRequest.getTypeName()));
        }
        if(roomTypeSearchRequest.getMinPrice() != null){
            spec = spec.and(RoomTypeSpecification.hasMinPrice(roomTypeSearchRequest.getMinPrice()));
        }
        if(roomTypeSearchRequest.getMaxPrice() != null){
            spec = spec.and(RoomTypeSpecification.hasMaxPrice(roomTypeSearchRequest.getMaxPrice()));
        }
        if(roomTypeSearchRequest.getMaxPeople() !=null){
            spec = spec.and(RoomTypeSpecification.hasMinMaxPeople(roomTypeSearchRequest.getMaxPeople()));
        }

        List<RoomType> roomTypes = roomTypeRepository.findAll(spec);

        List<RoomTypeResponse> roomTypeResponses = roomTypes.stream().map(r -> {
            RoomTypeResponse response = roomTypeMapper.toResponse(r);
            roomImageRepository.findByRoomTypeIdAndIsThumbnailTrue(r.getId())
                    .ifPresent(img -> response.setThumbnail(img.getImageUrl()));
            return response;
        })
                .toList();

        return roomTypeResponses;
    }

    @Override
    public RoomTypeDetailResponse getRoomTypeById(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException());

        List<RoomImageResponse> images = roomImageRepository.findByRoomTypeId(id)
                .stream().map(img -> new RoomImageResponse(img.getId(), img.getImageUrl(), img.getIsThumbnail())).toList();

        List<RoomTypeFurniture> furnitures = roomTypeFurnitureRepository.findByRoomTypeId(id);

        List<FurnitureInRoomTypeResponse> furnitureInRoomTypeResponse = furnitures.stream().map(roomTypeMapper::toFurnitureInRoomType).toList();

        RoomTypeDetailResponse roomTypeDetailResponse = roomTypeMapper.toDetailResponse(roomType);
        roomTypeDetailResponse.setImages(images);
        roomTypeDetailResponse.setFurniture(furnitureInRoomTypeResponse);

        return roomTypeDetailResponse;
    }

    @Override
    @Transactional
    public RoomTypeResponse update(Long id, RoomTypeUpdateRequest roomTypeUpdateRequest) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException());

        roomTypeMapper.fromUpdate(roomTypeUpdateRequest, roomType);

        return roomTypeMapper.toResponse(roomTypeRepository.save(roomType));
    }

    @Override
    @Transactional
    public void furnituresMapping(Long id, RoomTypeFurnitureRequest roomTypeFurnitureRequest) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException());

        roomTypeFurnitureRepository.deleteByRoomTypeId(id);

        List<Long> furnitureIds = roomTypeFurnitureRequest.getFurnitures()
                .stream().map(RoomTypeFurnitureRequest.FurnitureItem::getFurnitureId).toList();

        Map<Long, Furniture> furnitureMap = furnitureRepository.findAllById(furnitureIds)
                .stream().collect(Collectors.toMap(Furniture::getId, f -> f));

        List<RoomTypeFurniture> newList = roomTypeFurnitureRequest.getFurnitures().stream()
                .filter(item -> item.getQuantity() != null && item.getQuantity() > 0)
                .map(item -> new RoomTypeFurniture(
                        null,
                        roomType,
                        furnitureMap.get(item.getFurnitureId()),
                        item.getQuantity()
                ))
                .toList();

        roomTypeFurnitureRepository.saveAll(newList);
    }

    @Override
    public List<String> getTypes() {
        return Arrays.stream(RoomTypeName.values())
                .map(Enum::name)
                .toList();
    }
}
