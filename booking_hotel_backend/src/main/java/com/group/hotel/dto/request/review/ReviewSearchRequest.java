package com.group.hotel.dto.request.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewSearchRequest {
    private Boolean hasReply;
    private Integer rating;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String customerName;
}