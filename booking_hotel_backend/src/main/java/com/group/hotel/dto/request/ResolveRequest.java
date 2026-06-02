package com.group.hotel.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Tự động tạo getter, setter, toString, equals, hashCode
@NoArgsConstructor // Cần thiết cho Jackson để khởi tạo object
@AllArgsConstructor
public class ResolveRequest {
    private String resolutionNote;

    public String getResolutionNote() { // Phải viết thủ công hàm này
        return resolutionNote;
    }
}