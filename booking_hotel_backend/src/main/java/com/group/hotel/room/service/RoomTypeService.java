package com.group.hotel.room.service;

import com.group.hotel.room.dto.request.RoomTypeFurnitureRequest;
import com.group.hotel.room.dto.request.RoomTypeSearchRequest;
import com.group.hotel.room.dto.request.RoomTypeUpdateRequest;
import com.group.hotel.room.dto.response.RoomTypeDetailResponse;
import com.group.hotel.room.dto.response.RoomTypeResponse;

import java.util.List;

public interface RoomTypeService {
    List<RoomTypeResponse> getAll(RoomTypeSearchRequest roomTypeSearchRequest);
    RoomTypeDetailResponse getRoomTypeById(Long id);
    RoomTypeResponse update(Long id, RoomTypeUpdateRequest roomTypeUpdateRequest);
    void furnituresMapping(Long id, RoomTypeFurnitureRequest roomTypeFurnitureRequest);
    List<String> getTypes();
}
