package com.group.hotel.service;

import com.group.hotel.dto.request.CleaningRequest;
import com.group.hotel.dto.response.CleaningResponse;
import com.group.hotel.dto.response.CleaningTaskResponse;

public interface HousekeepingService {
//    CleaningResponse createCleaningRequest(CleaningRequest request);
    CleaningResponse createCleaningRequest (String roomNumber , String note);
}
