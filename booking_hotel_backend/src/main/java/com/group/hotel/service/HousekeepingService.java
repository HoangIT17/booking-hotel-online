package com.group.hotel.service;

import com.group.hotel.dto.request.cleaning.CleaningRequest;
import com.group.hotel.dto.response.cleaning.CleaningResponse;
import com.group.hotel.dto.response.cleaning.CleaningTaskResponse;

public interface HousekeepingService {
//    CleaningResponse createCleaningRequest(CleaningRequest request);
    CleaningResponse createCleaningRequest (String roomNumber , String note);
}
