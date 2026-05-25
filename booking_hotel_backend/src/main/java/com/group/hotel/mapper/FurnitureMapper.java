package com.group.hotel.mapper;

import com.group.hotel.dto.request.FurnitureCreateRequest;
import com.group.hotel.dto.request.FurnitureUpdateRequest;
import com.group.hotel.dto.response.FurnitureResponse;
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
