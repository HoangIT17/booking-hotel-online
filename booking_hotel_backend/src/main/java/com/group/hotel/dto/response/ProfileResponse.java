package com.group.hotel.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileResponse {
    private Long id;
    private String email;
    private String role;
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate birthday;
    private String avatar;
    private String address;
    private Integer experienceYears;
    private LocalDate hireDate;
    private String skills;
}