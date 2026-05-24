package com.group.hotel.mapper;

import com.group.hotel.dto.request.ProfileUpdateRequest;
import com.group.hotel.dto.response.ProfileResponse;
import com.group.hotel.entity.Profile;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    // 1. Ánh xạ dữ liệu trả về cho API View
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "role", source = "user.role.roleName")
    ProfileResponse toProfileResponse(Profile profile);

    // 2. Ánh xạ dữ liệu cập nhật từ Request
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "hireDate", ignore = true)
    @Mapping(target = "experienceYears", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "avatar", ignore = true) // Frontend gửi file riêng, Service sẽ tự set
    void updateProfileFromRequest(ProfileUpdateRequest request, @MappingTarget Profile profile);

    // 3. Logic lọc JSON theo Role
    @AfterMapping
    default void filterFieldsByRole(Profile profile, @MappingTarget ProfileResponse response) {
        String roleName = profile.getUser().getRole().getRoleName();
        // Cấp quyền cho cả ADMIN
        List<String> employeeRoles = List.of("STAFF", "MANAGER", "RECEPTIONIST", "ADMIN");

        if (!employeeRoles.contains(roleName)) {
            response.setExperienceYears(null);
            response.setHireDate(null);
            response.setSkills(null);
        } else {
            if (response.getExperienceYears() == null) {
                response.setExperienceYears(0);
            }
            if (response.getSkills() == null) {
                response.setSkills("");
            }
        }
    }
}