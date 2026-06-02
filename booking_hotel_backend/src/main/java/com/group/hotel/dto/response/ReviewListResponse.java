package com.group.hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewListResponse {
    private Long reviewId;
    private String username;
    private String comment;
    private Integer rating;
    private LocalDateTime createdAt;
}
