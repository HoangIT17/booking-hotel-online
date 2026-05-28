package com.group.hotel.service;

import com.group.hotel.dto.request.CreateMaintenanceRequest;
import com.group.hotel.dto.request.RoomCreateRequest;
import com.group.hotel.dto.request.RoomSearchRequest;
import com.group.hotel.dto.request.RoomUpdateRequest;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.response.MaintenanceResponse;
import com.group.hotel.dto.response.RoomDetailResponse;
import com.group.hotel.dto.response.RoomResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RoomService {
    List<String> getStatuses();
    List<String> getRoomTypes();
    PageResponse<RoomResponse> getAll(RoomSearchRequest roomSearchRequest, Pageable pageable);
    RoomDetailResponse getDetail(Long id);
    RoomResponse create(RoomCreateRequest roomCreateRequest);
    RoomResponse update(Long id, RoomUpdateRequest roomUpdateRequest);
    void delete(Long id);
    RoomResponse restore(Long id);
    RoomDetailResponse updateFurnitures(Long id, List<Long> furnitureIds);
    String uploadImage(Long id, MultipartFile file);
    RoomDetailResponse getRoomDetail(String roomNumber);
    MaintenanceResponse createMaintenanceRequest(
            CreateMaintenanceRequest request
    );

}
