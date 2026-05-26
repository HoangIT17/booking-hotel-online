package com.group.hotel.user.controller;

import com.group.hotel.user.dto.request.ProfileUpdateRequest;
import com.group.hotel.user.dto.response.ProfileResponse;
import com.group.hotel.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * API: Lấy thông tin hồ sơ của chính mình (dựa vào Token đăng nhập)
     * Method: GET
     * URL: http://localhost:8080/api/v1/profiles/me
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    /**
     * API: Cập nhật hồ sơ (Hỗ trợ upload ảnh đại diện)
     * Method: PUT
     * URL: http://localhost:8080/api/v1/profiles/me
     * Consumes: multipart/form-data
     */
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> updateMyProfile(
            @ModelAttribute ProfileUpdateRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(profileService.updateMyProfile(request, file));
    }
}