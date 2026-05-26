package com.group.hotel.room.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomUpdateRequest {
    @NotNull
    private Long roomTypeId;
    @NotBlank
    private String status;
    private String description;
}
