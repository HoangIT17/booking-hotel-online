package com.group.hotel.service;

import com.group.hotel.dto.request.IncidentDecisionRequest;
import com.group.hotel.dto.request.ResolveRequest;
import com.group.hotel.dto.response.IncidentDetailResponse;
import com.group.hotel.dto.response.IncidentListResponse;
import com.group.hotel.dto.response.IncidentReport;
import com.group.hotel.dto.response.IncidentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface IncidentService {
    IncidentListResponse getListIncidents(
            String status, String type, String priority, Long roomId, Long staffId,
            LocalDate fromDate, LocalDate toDate,
            String sortBy, String direction, int page, int size
    );
    IncidentDetailResponse getIncidentById(Long id);
    IncidentDetailResponse decideOnIncident(Long id, IncidentDecisionRequest request);
    IncidentResponse resolveIncident(Long id, ResolveRequest request);
    Page<IncidentReport> getDamagedOrLostReport(Pageable pageable);
}