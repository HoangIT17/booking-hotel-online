package com.group.hotel.mapper;

import com.group.hotel.dto.request.user.ProfileUpdateRequest;
import com.group.hotel.dto.response.user.ProfileResponse;
import com.group.hotel.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "role", source = "user.role.roleName")
    ProfileResponse toProfileResponse(Profile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "hireDate", ignore = true)
    @Mapping(target = "experienceYears", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    void updateProfileFromRequest(ProfileUpdateRequest request, @MappingTarget Profile profile);
}