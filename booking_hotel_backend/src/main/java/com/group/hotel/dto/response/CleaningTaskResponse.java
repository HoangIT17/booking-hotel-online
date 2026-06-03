package com.group.hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CleaningTaskResponse {

    private String roomNumber;

    private Integer floor;

    private String cleaningStatus;
}