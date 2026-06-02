package com.group.hotel.dto.response.user;

import com.fasterxml.jackson.annotation.JsonFormat; // 🌟 BẮT BUỘC: Thêm import này
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

    // 🌟 ĐÃ CẬP NHẬT: Ép định dạng chuẩn quốc tế để ô input type="date" của Front-end ăn khớp tự động
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    private String avatar;
    private String address;
    private Integer experienceYears;

    // 🌟 ĐÃ CẬP NHẬT: Ép trả về chuỗi ngày/tháng/năm Việt Nam để Front-end hiển thị tĩnh là ăn ngay
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate hireDate;

    private String skills;
}