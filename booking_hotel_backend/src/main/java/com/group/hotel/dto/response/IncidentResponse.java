package com.group.hotel.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.group.hotel.entity.Incident;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class) // Chuyển thành room_number, furniture_name, created_at, decided_at
public class IncidentResponse {
    private Long id;
    private RoomInfo room;
    private StaffInfo staff;
    private String description;
    private String type;
    private String priority;
    private String status;
    private String furnitureName;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime decidedAt;

    @Data
    @AllArgsConstructor
    public static class RoomInfo {
        private Long id;
        private String roomNumber;
        private Integer floor;
    }

    @Data
    @AllArgsConstructor
    public static class StaffInfo {
        private Long id;
        private String fullName;
        private String username;
    }
    private String resolutionNote;
    public static IncidentResponse fromEntity(Incident incident) {
        return IncidentResponse.builder()
                .id(incident.getId())
                .room(new RoomInfo(
                        incident.getRoom().getId(),
                        incident.getRoom().getRoomNumber(),
                        incident.getRoom().getFloor()))
                .staff(new StaffInfo(
                        incident.getStaff().getId(),
                        incident.getStaff().getProfile() != null ? incident.getStaff().getProfile().getFullName() : "Chưa cập nhật",
                        incident.getStaff().getUsername()))
                .description(incident.getDescription())
                .type(incident.getIncidentType() != null ? incident.getIncidentType().name() : null)
                .status(incident.getStatus() != null ? incident.getStatus().name() : null)
                .furnitureName(incident.getFurniture() != null ? incident.getFurniture().getFurnitureName() : null)
                .createdAt(incident.getCreatedAt())
                .decidedAt(incident.getUpdatedAt())
                .resolutionNote(incident.getResolutionNote()) // Thêm dòng này để khớp với tính năng Resolve
                .build();
    }
}