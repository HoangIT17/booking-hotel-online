package com.group.hotel.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomCreateRequest {
    @NotNull
    private Long roomTypeId;
    @NotBlank
    private String roomNumber;
    @NotNull
    private Integer floor;
    @NotBlank
    private String status;

    private String description;
}
