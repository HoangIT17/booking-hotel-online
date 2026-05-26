package com.group.hotel.room.mapper;

import com.group.hotel.room.dto.request.FurnitureCreateRequest;
import com.group.hotel.room.dto.request.FurnitureUpdateRequest;
import com.group.hotel.room.dto.response.FurnitureResponse;
import com.group.hotel.room.entity.Furniture;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;


@Mapper(componentModel = "spring")
public interface FurnitureMapper {

    FurnitureResponse toResponse(Furniture furniture);

    Furniture fromCreate(FurnitureCreateRequest furnitureCreateRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = IGNORE)
    void fromUpdate(FurnitureUpdateRequest furnitureUpdateRequest, @MappingTarget Furniture furniture);
}
