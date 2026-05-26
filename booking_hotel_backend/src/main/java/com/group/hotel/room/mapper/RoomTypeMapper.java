package com.group.hotel.room.mapper;

import com.group.hotel.room.dto.request.RoomTypeUpdateRequest;
import com.group.hotel.room.dto.response.FurnitureInRoomTypeResponse;
import com.group.hotel.room.dto.response.RoomTypeDetailResponse;
import com.group.hotel.room.dto.response.RoomTypeResponse;
import com.group.hotel.room.entity.RoomType;
import com.group.hotel.room.entity.RoomTypeFurniture;
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
