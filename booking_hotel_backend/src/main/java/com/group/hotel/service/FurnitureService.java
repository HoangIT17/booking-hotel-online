package com.group.hotel.service;

import com.group.hotel.dto.request.furniture.FurnitureCreateRequest;
import com.group.hotel.dto.request.furniture.FurnitureSearchRequest;
import com.group.hotel.dto.request.furniture.FurnitureUpdateRequest;
import com.group.hotel.dto.response.furniture.FurnitureResponse;

import java.util.List;

public interface FurnitureService {
    List<FurnitureResponse> getAll(FurnitureSearchRequest furnitureSearchRequest);
    FurnitureResponse create(FurnitureCreateRequest furnitureCreateRequest);
    FurnitureResponse update(Long id, FurnitureUpdateRequest furnitureUpdateRequest);
    void delete(Long id);
    List<String> getTypes();
}
