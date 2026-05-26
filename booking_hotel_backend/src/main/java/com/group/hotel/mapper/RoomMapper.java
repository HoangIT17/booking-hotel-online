package com.group.hotel.mapper;

import com.group.hotel.dto.request.RoomCreateRequest;
import com.group.hotel.dto.request.RoomUpdateRequest;
import com.group.hotel.dto.response.RoomAvailableResponse;
import com.group.hotel.dto.response.RoomResponse;
import com.group.hotel.entity.Furniture;
import com.group.hotel.entity.Room;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    RoomResponse toResponse(Room room);

    RoomDetailResponse toDetailResponse(Room room);

    RoomFurnitureResponse toFurnitureResponse(Furniture furniture);

    Room fromCreate(RoomCreateRequest roomCreateRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void fromUpdate(RoomUpdateRequest request, @MappingTarget Room room);

    @Mapping(target = "roomId", source = "id")
    @Mapping(target = "roomType", source = "roomType.typeName")
    @Mapping(target = "price", source = "roomType.basePrice")
    @Mapping(target = "capacity", source = "roomType.maxPeople")
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    RoomAvailableResponse toAvailableResponse(Room room);
}
