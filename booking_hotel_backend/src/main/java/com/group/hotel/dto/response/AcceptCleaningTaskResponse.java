package com.group.hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptCleaningTaskResponse {

    private boolean success;

    private String roomNumber;

    private String cleaningStatus;

    private String assignedStaff;

    private String message;
}