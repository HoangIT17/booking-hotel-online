package com.group.hotel.mapper;

import com.group.hotel.dto.request.furniture.FurnitureCreateRequest;
import com.group.hotel.dto.request.furniture.FurnitureUpdateRequest;
import com.group.hotel.dto.response.furniture.FurnitureResponse;
import com.group.hotel.entity.Furniture;
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
