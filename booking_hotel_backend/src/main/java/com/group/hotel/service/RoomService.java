package com.group.hotel.service;

import com.group.hotel.dto.request.*;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.response.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

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
    List<CleaningTaskResponse> getCleaningTasks(
            String shift,
            Integer floor
    );

    UpdateRoomStatusResponse updateRoomStatus(
            String roomNumber,
            UpdateRoomStatusRequest request
    );
    AcceptCleaningTaskResponse acceptCleaningTask(String roomNumber);
    Map<String, Object> createFurnitureIncident(CreateIncidentRequest request);
}
