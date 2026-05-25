package com.group.hotel.service;

import com.group.hotel.dto.request.MaintenanceRequest;
import com.group.hotel.dto.request.RoomCreateRequest;
import com.group.hotel.dto.request.RoomSearchRequest;
import com.group.hotel.dto.request.RoomUpdateRequest;
import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.response.MaintenanceResponse;
import com.group.hotel.dto.response.RoomResponse;
import com.group.hotel.dto.response.RoomTypeDetailResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoomService {
    List<String> getStatuses();
    PageResponse<RoomResponse> getAll(RoomSearchRequest roomSearchRequest, Pageable pageable);
    RoomResponse create(RoomCreateRequest roomCreateRequest);
    RoomResponse update(Long id, RoomUpdateRequest roomUpdateRequest);
    void delete(Long id);
    RoomResponse restore(Long id);

    RoomTypeDetailResponse getRoomTypeDetail(String roomNumber);
    MaintenanceResponse createMaintenanceRequest(
            MaintenanceRequest request,
            Long staffId
    );

}
