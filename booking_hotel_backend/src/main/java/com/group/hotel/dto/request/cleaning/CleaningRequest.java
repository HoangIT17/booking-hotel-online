package com.group.hotel.dto.request.cleaning;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO cho yêu cầu tạo dọn dẹp
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CleaningRequest {
    private String note; // Ghi chú thêm nếu cần
}