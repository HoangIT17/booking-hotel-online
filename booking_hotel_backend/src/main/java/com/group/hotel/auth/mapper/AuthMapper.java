package com.group.hotel.auth.mapper;

import com.group.hotel.auth.dto.request.RegisterRequest;
import com.group.hotel.auth.dto.response.RegisterResponse;
import com.group.hotel.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    User toUser(RegisterRequest request);

    @Mapping(target = "userId", source = "id")
    @Mapping(target = "fullName", source = "profile.fullName")
    RegisterResponse toRegisterResponse(User user);
}