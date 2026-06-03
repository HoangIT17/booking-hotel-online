package com.group.hotel.mapper;

import com.group.hotel.dto.request.auth.RegisterRequest;
import com.group.hotel.dto.response.auth.RegisterResponse;
import com.group.hotel.entity.User;
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