package com.group.hotel.service;

import com.group.hotel.dto.response.FurnitureItemResponse;

import java.util.List;

public interface IncidentService {

    List<FurnitureItemResponse> getFurnitureByRoom(String roomNumber);
}