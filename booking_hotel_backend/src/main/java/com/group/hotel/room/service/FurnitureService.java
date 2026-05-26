package com.group.hotel.room.service;

import com.group.hotel.room.dto.request.FurnitureCreateRequest;
import com.group.hotel.room.dto.request.FurnitureSearchRequest;
import com.group.hotel.room.dto.request.FurnitureUpdateRequest;
import com.group.hotel.room.dto.response.FurnitureResponse;

import java.util.List;

public interface FurnitureService {
    List<FurnitureResponse> getAll(FurnitureSearchRequest furnitureSearchRequest);
    FurnitureResponse create(FurnitureCreateRequest furnitureCreateRequest);
    FurnitureResponse update(Long id, FurnitureUpdateRequest furnitureUpdateRequest);
    void delete(Long id);
    List<String> getTypes();
}
