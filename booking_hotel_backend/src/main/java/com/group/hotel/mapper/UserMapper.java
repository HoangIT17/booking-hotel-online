package com.group.hotel.mapper;

import com.group.hotel.dto.request.user.UserCreateRequest;
import com.group.hotel.dto.request.user.UserUpdateRequest;
import com.group.hotel.dto.response.user.UserResponse;
import com.group.hotel.entity.Profile;
import com.group.hotel.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "provider", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "profile", ignore = true)
    User toUser(UserCreateRequest request);

    @Mapping(target = "fullName", source = "profile.fullName")
    @Mapping(target = "phone", source = "profile.phone")
    @Mapping(target = "role", source = "role.roleName")
    UserResponse toUserResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "gender", ignore = true)
    @Mapping(target = "birthday", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "experienceYears", ignore = true)
    @Mapping(target = "hireDate", ignore = true)
    @Mapping(target = "skills", ignore = true)
    Profile toProfile(UserCreateRequest request);
}