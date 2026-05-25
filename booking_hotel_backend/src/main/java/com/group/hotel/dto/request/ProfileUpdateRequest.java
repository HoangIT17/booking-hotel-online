package com.group.hotel.dto.request;

import com.group.hotel.enums.Gender;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfileUpdateRequest {
    private String fullName;
    private String phone;
    private Gender gender;
    private LocalDate birthday;
    private String address;
    private Integer experienceYears;
    private String skills;
}