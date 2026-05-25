package com.group.hotel.mapper;

import com.group.hotel.dto.request.RoomTypeUpdateRequest;
import com.group.hotel.dto.response.FurnitureInRoomTypeResponse;
import com.group.hotel.dto.response.RoomTypeDetailResponse;
import com.group.hotel.dto.response.RoomTypeResponse;
import com.group.hotel.entity.RoomType;
import com.group.hotel.entity.RoomTypeFurniture;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface RoomTypeMapper {

    RoomTypeResponse toResponse(RoomType roomType);

    RoomTypeDetailResponse toDetailResponse(RoomType roomType);

    @Mapping(source = "furniture.furnitureName", target = "furnitureName")
    @Mapping(source = "furniture.iconName", target = "iconName")
    FurnitureInRoomTypeResponse toFurnitureInRoomType(RoomTypeFurniture roomTypeFurniture);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void fromUpdate(RoomTypeUpdateRequest roomTypeUpdateRequest, @MappingTarget RoomType roomType);
}
