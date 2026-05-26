package com.group.hotel.dto.response;

public record CleaningTaskResponse(
        String roomNumber,
        int floor,
        String cleaningStatus
) {}