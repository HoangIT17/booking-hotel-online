package com.group.hotel.service.impl;

import com.group.hotel.dto.request.IncidentDecisionRequest;
import com.group.hotel.dto.request.ResolveRequest;
import com.group.hotel.dto.response.IncidentDetailResponse;
import com.group.hotel.dto.response.IncidentListResponse;
import com.group.hotel.dto.response.IncidentReport;
import com.group.hotel.dto.response.IncidentResponse;
import com.group.hotel.entity.Incident;
import com.group.hotel.enums.IncidentStatus;
import com.group.hotel.enums.RoomStatus;
import com.group.hotel.exception.ResourceNotFoundException;
import com.group.hotel.repository.IncidentRepository;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.service.IncidentService;
import com.group.hotel.specification.IncidentSpecification;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final RoomRepository roomRepository;


    @Override
    @Transactional(readOnly = true)
    public IncidentListResponse getListIncidents(
            String status, String type, String priority, Long roomId, Long staffId,
            LocalDate fromDate, LocalDate toDate,
            String sortBy, String direction, int page, int size) {

        // Đồng bộ sắp xếp trường thời gian
        String sortProperty = sortBy.equals("created_at") ? "createdAt" : sortBy;

        Sort sort = direction != null && direction.equalsIgnoreCase("desc")
                ? Sort.by(sortProperty).descending()
                : Sort.by(sortProperty).ascending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Specification<Incident> spec = Specification.where(IncidentSpecification.hasStatus(status))
                .and(IncidentSpecification.hasType(type))
                .and(IncidentSpecification.hasPriority(priority))
                .and(IncidentSpecification.hasRoomId(roomId))
                .and(IncidentSpecification.hasStaffId(staffId))
                .and(IncidentSpecification.isFromDate(fromDate))
                .and(IncidentSpecification.isToDate(toDate));

        Page<Incident> incidentPage = incidentRepository.findAll(spec, pageable);

        List<IncidentResponse> items = incidentPage.getContent().stream().map(incident ->
                IncidentResponse.builder()
                        .id(incident.getId())
                        .room(new IncidentResponse.RoomInfo(
                                incident.getRoom().getId(),
                                incident.getRoom().getRoomNumber(),
                                incident.getRoom().getFloor()))
                        .staff(new IncidentResponse.StaffInfo(
                                incident.getStaff().getId(),
                                incident.getStaff().getProfile() != null ? incident.getStaff().getProfile().getFullName() : "Chưa cập nhật",
                                incident.getStaff().getUsername()))
                        .description(incident.getDescription())
                        .type(incident.getIncidentType() != null ? incident.getIncidentType().name() : null)
                        .priority(priority != null ? priority : "NORMAL")
                        .status(incident.getStatus() != null ? incident.getStatus().name() : null)
                        // ĐÃ ĐỒNG BỘ: Sử dụng .getFurnitureName() theo đúng Entity Furniture thực tế
                        .furnitureName(incident.getFurniture() != null ? incident.getFurniture().getFurnitureName() : null)
                        .images(new ArrayList<>())
                        .createdAt(incident.getCreatedAt())
                        .decidedAt(incident.getUpdatedAt())
                        .build()
        ).collect(Collectors.toList());

        return IncidentListResponse.builder()
                .items(items)
                .page(page)
                .size(size)
                .totalItems(incidentPage.getTotalElements())
                .totalPages(incidentPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public IncidentDetailResponse getIncidentById(Long id) {
        // Tìm sự cố trong DB, nếu không có ném lỗi 404
        Incident incident = incidentRepository.findDetailById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dữ liệu chi tiết cho sự cố #" + id));

        // Build dữ liệu trả về an toàn, không sợ lỗi NullPointerException
        IncidentDetailResponse.IncidentDetailResponseBuilder responseBuilder = IncidentDetailResponse.builder()
                .id(incident.getId())
                .description(incident.getDescription())
                .type(incident.getIncidentType())
                .status(incident.getStatus())
                .createdAt(incident.getCreatedAt())
                .updatedAt(incident.getUpdatedAt())
                .managerNote(null)
                .resolutionNote(null)
                .images(new ArrayList<>());

        // Khớp thông tin phòng (Room)
        if (incident.getRoom() != null) {
            responseBuilder.room(IncidentDetailResponse.RoomDTO.builder()
                    .id(incident.getRoom().getId())
                    .roomNumber(incident.getRoom().getRoomNumber())
                    .floor(incident.getRoom().getFloor())
                    .status(incident.getRoom().getStatus() != null ? incident.getRoom().getStatus().name() : null)
                    .build());
        }

        // Khớp thông tin nhân viên báo cáo (Staff - lấy từ thực thể User của bạn)
        if (incident.getStaff() != null) {
            String fullName = incident.getStaff().getUsername();
            if (incident.getStaff().getProfile() != null) {
                fullName = incident.getStaff().getProfile().getFullName();
            }

            responseBuilder.staff(IncidentDetailResponse.StaffDTO.builder()
                    .id(incident.getStaff().getId())
                    .fullName(fullName)
                    .username(incident.getStaff().getUsername())
                    .build());
        }

        // Khớp thông tin nội thất (Furniture)
        if (incident.getFurniture() != null) {
            responseBuilder.furnitureId(incident.getFurniture().getId());
            // 🛠️ ĐÃ ĐỒNG BỘ: Đổi từ .getName() thành .getFurnitureName() để ăn khớp hoàn toàn với thực tế DB
            responseBuilder.furnitureName(incident.getFurniture().getFurnitureName());
        }

        return responseBuilder.build();
    }

    // Trong IncidentServiceImpl.java
    @Override
    @Transactional
    public IncidentDetailResponse decideOnIncident(Long id, IncidentDecisionRequest request) {
        // Tìm sự cố
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự cố #" + id));

        // Ràng buộc: Chỉ xử lý PENDING
        if (incident.getStatus() != IncidentStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể xử lý các sự cố ở trạng thái PENDING");
        }

        // Logic nghiệp vụ
        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            incident.setStatus(IncidentStatus.APPROVED);
            // Tự động chuyển phòng sang MAINTENANCE
            if (incident.getRoom() != null) {
                incident.getRoom().setStatus(RoomStatus.MAINTAIN);
            }
        } else if ("REJECT".equalsIgnoreCase(request.getAction())) {
            if (request.getManager_note() == null || request.getManager_note().isBlank()) {
                throw new IllegalArgumentException("Manager note là bắt buộc khi từ chối!");
            }
            incident.setStatus(IncidentStatus.REJECTED);
            incident.setManagerNote(request.getManager_note());
        }

        incident.setDecidedAt(LocalDateTime.now());
        incidentRepository.save(incident);

        // Trả về response chi tiết như đã có
        return getIncidentById(id);
    }

    @Override
    @Transactional
    public IncidentResponse resolveIncident(Long id, ResolveRequest request) {
        // 1. Dùng đúng tên biến đã khai báo là 'incidentRepository' (không phải 'incidentRepo')
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        // 2. Kiểm tra nghiệp vụ (Dùng Enum IncidentStatus thay vì String để an toàn)
        if (incident.getStatus() != IncidentStatus.APPROVED) {
            throw new RuntimeException("Incident must be in APPROVED status to be resolved");
        }

        // 3. Cập nhật sự cố
        incident.setStatus(IncidentStatus.FIXED); // Dùng Enum của bạn
        incident.setResolutionNote(request.getResolutionNote()); // Lưu ý tên field phải khớp với DTO
        incident.setResolvedAt(LocalDateTime.now());
        incidentRepository.save(incident);

        // 4. Cập nhật phòng về trạng thái READY (Cần inject RoomRepository)
        if (incident.getRoom() != null) {
            incident.getRoom().setStatus(RoomStatus.READY);
            roomRepository.save(incident.getRoom()); // Cần khai báo roomRepository
        }

        return IncidentResponse.fromEntity(incident);
    }

    // File: src/main/java/com/group/hotel/service/impl/IncidentServiceImpl.java
    @Override
    public Page<IncidentReport> getDamagedOrLostReport(Pageable pageable) {
        return incidentRepository.findDamagedOrLostItems(pageable).map(incident -> {
            // Lấy tên thiết bị an toàn từ entity Furniture
            String name = "---";
            if (incident.getFurniture() != null) {
                name = incident.getFurniture().getFurnitureName(); // Dùng getFurnitureName() thay vì getName()
            }

            // Lấy thông tin phòng và nhân viên an toàn
            String roomNum = (incident.getRoom() != null) ? incident.getRoom().getRoomNumber() : "N/A";
            String staffName = (incident.getStaff() != null) ? incident.getStaff().getUsername() : "N/A";
            String status = (incident.getStatus() != null) ? incident.getStatus().name() : "PENDING";
            String createdAt = (incident.getCreatedAt() != null) ? incident.getCreatedAt().toString() : "";

            return IncidentReport.builder()
                    .id(incident.getId())
                    .roomNumber(roomNum)
                    .furnitureName(name) // Tên thiết bị đã được lấy đúng
                    .description(incident.getDescription())
                    .staffName(staffName)
                    .status(status)
                    .createdAt(createdAt)
                    .build();
        });
    }
}