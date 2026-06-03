package com.group.hotel.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // <--- Đây là annotation quan trọng nhất bạn đang thiếu
public class CleaningResponse {
    private Long id;
    private String roomNumber;
    private String status;
    private String message;
}