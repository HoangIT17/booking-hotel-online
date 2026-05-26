package com.group.hotel.room.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomImageResponse {
    private Long id;
    private String imageUrl;
    private Boolean isThumbnail;
}
