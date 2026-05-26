package com.group.hotel.user.service;

import com.group.hotel.user.dto.request.ProfileUpdateRequest;
import com.group.hotel.user.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
    ProfileResponse getMyProfile();
    ProfileResponse updateMyProfile(ProfileUpdateRequest request, MultipartFile file);
}