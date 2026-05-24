package com.group.hotel.service;

import com.group.hotel.dto.request.ProfileUpdateRequest;
import com.group.hotel.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
    ProfileResponse getMyProfile();
    ProfileResponse updateMyProfile(ProfileUpdateRequest request, MultipartFile file);
}