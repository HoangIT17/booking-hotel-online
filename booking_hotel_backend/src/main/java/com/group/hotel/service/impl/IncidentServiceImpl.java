package com.group.hotel.service.impl;

import com.group.hotel.dto.response.FurnitureItemResponse;
import com.group.hotel.entity.Room;
import com.group.hotel.entity.RoomType;
import com.group.hotel.entity.RoomTypeFurniture;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.repository.RoomTypeFurnitureRepository;
import com.group.hotel.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final RoomRepository roomRepository;
    private final RoomTypeFurnitureRepository roomTypeFurnitureRepository;

    @Override
    public List<FurnitureItemResponse> getFurnitureByRoom(String roomNumber) {

        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomType roomType = room.getRoomType();

        List<RoomTypeFurniture> furnitureList =
                roomTypeFurnitureRepository.findByRoomType(roomType);

        return furnitureList.stream()
                .map(item -> FurnitureItemResponse.builder()
                        .furnitureId(item.getFurniture().getId())
                        .furnitureName(item.getFurniture().getFurnitureName())
                        .furnitureType(item.getFurniture().getFurnitureType().name())
                        .quantity(item.getQuantity())
                        .description(item.getFurniture().getDescription())
                        .build())
                .toList();
    }
}