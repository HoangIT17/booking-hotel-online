package com.group.hotel.room.mapper;

import com.group.hotel.room.dto.request.RoomCreateRequest;
import com.group.hotel.room.dto.request.RoomUpdateRequest;
import com.group.hotel.room.dto.response.RoomAvailableResponse;
import com.group.hotel.room.dto.response.RoomResponse;
import com.group.hotel.room.entity.Room;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    @Mapping(source = "roomType.id", target = "roomTypeId")
    @Mapping(source = "roomType.typeName", target = "roomTypeName")
    RoomResponse toResponse(Room room);

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
