package com.group.hotel.service.impl;

import com.group.hotel.dto.response.cleaning.CleaningResponse;
import com.group.hotel.entity.HousekeepingLog;
import com.group.hotel.entity.Room;
import com.group.hotel.enums.HousekeepingStatus;
import com.group.hotel.enums.RoomStatus;
import com.group.hotel.repository.HousekeepingLogRepository;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.service.HousekeepingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HousekeepingServiceImpl implements HousekeepingService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private HousekeepingLogRepository housekeepingRepository;

    @Transactional
    @Override
    public CleaningResponse createCleaningRequest(String roomNumber, String note) {
        Room room = roomRepository.findByRoomNumberAndIsDeletedFalse(roomNumber)
                .orElseThrow(() -> new RuntimeException("Phòng số " + roomNumber + " không tồn tại"));

        if (room.getStatus() != RoomStatus.OCCUPIED) {
            throw new RuntimeException("Chỉ phòng đang sử dụng (OCCUPIED) mới được yêu cầu dọn dẹp!");
        }

        // Gán staff = null một cách tường minh
        HousekeepingLog log = HousekeepingLog.builder()
                .room(room)
                .status(HousekeepingStatus.PENDING)
                .notes(note)
                .priority("NORMAL")
                .staff(null) // Đảm bảo gán null nếu DB cho phép
                .build();

        HousekeepingLog savedLog = housekeepingRepository.save(log);

        room.setStatus(RoomStatus.DIRTY);
        roomRepository.save(room);

        return CleaningResponse.builder()
                .id(savedLog.getId())
                .roomNumber(room.getRoomNumber())
                .status(savedLog.getStatus().name())
                .message("Đã tạo yêu cầu dọn dẹp thành công!")
                .build();
    }
}