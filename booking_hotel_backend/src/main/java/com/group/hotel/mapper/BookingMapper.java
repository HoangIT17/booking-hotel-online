package com.group.hotel.mapper;

import com.group.hotel.dto.response.RoomAvailableResponse;
import com.group.hotel.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(source = "id", target = "roomId")
    @Mapping(source = "maxPeople", target = "capacity")
    RoomAvailableResponse toAvailableResponse(Room room);
}
