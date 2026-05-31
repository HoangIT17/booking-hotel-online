package com.group.hotel.mapper;

import com.group.hotel.dto.request.RoomCreateRequest;
import com.group.hotel.dto.request.RoomUpdateRequest;
import com.group.hotel.dto.response.RoomDetailResponse;
import com.group.hotel.dto.response.RoomFurnitureResponse;
import com.group.hotel.dto.response.RoomResponse;
import com.group.hotel.entity.Furniture;
import com.group.hotel.entity.Room;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    RoomResponse toResponse(Room room);

    RoomDetailResponse toDetailResponse(Room room);

    RoomFurnitureResponse toFurnitureResponse(Furniture furniture);

    Room fromCreate(RoomCreateRequest roomCreateRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void fromUpdate(RoomUpdateRequest request, @MappingTarget Room room);

}
