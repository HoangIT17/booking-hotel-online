package com.group.hotel.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class IncidentDecisionRequest {
    @NotNull(message = "Action là bắt buộc")
    private String action; // APPROVE hoặc REJECT
    private String manager_note;
}