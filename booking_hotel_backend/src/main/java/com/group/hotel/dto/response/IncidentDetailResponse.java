package com.group.hotel.dto.response; // Đã sửa package theo log lỗi của bạn

import com.group.hotel.enums.IncidentStatus; // Khớp với enum thực tế của bạn
import com.group.hotel.enums.IncidentType;   // Khớp với enum thực tế của bạn
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentDetailResponse {
    private Long id;
    private RoomDTO room;
    private StaffDTO staff;
    private String description;
    private Long furnitureId;
    private String furnitureName;
    private IncidentType type;
    private IncidentStatus status;
    private String managerNote;
    private String resolutionNote;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class RoomDTO {
        private Long id;
        private String roomNumber;
        private Integer floor;
        private String status;
    }

    @Data
    @Builder
    public static class StaffDTO {
        private Long id;
        private String fullName;
        private String username;
    }
}