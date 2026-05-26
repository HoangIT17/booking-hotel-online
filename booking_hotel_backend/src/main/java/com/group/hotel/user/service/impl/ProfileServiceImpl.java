package com.group.hotel.user.service.impl;

import com.group.hotel.user.dto.request.ProfileUpdateRequest;
import com.group.hotel.user.dto.response.ProfileResponse;
import com.group.hotel.user.entity.Profile;
import com.group.hotel.user.entity.User;
import com.group.hotel.common.exception.AppException;
import com.group.hotel.common.exception.ErrorCode;
import com.group.hotel.user.mapper.ProfileMapper;
import com.group.hotel.user.repository.ProfileRepository;
import com.group.hotel.user.repository.UserRepository;
import com.group.hotel.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Profile profile = profileRepository.findByUserUsername(username)
                .orElseGet(() -> {
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                    return createNewProfile(user);
                });

        return profileMapper.toProfileResponse(profile);
    }

    @Override
    @Transactional
    public ProfileResponse updateMyProfile(ProfileUpdateRequest request, MultipartFile file) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 1. Tìm Profile hiện tại hoặc tạo rỗng
        Profile profile = profileRepository.findByUserUsername(username)
                .orElseGet(() -> {
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                    return createNewProfile(user);
                });

        // 2. Map dữ liệu Text
        profileMapper.updateProfileFromRequest(request, profile);

        // 3. Phân quyền Update trường đặc thù
        String roleName = profile.getUser().getRole().getRoleName();
        List<String> employeeRoles = List.of("STAFF", "MANAGER", "RECEPTIONIST");

        if (employeeRoles.contains(roleName)) {
            profile.setExperienceYears(request.getExperienceYears());
            profile.setSkills(request.getSkills());
        }

        // 4. Xử lý Upload Avatar (Lưu vào ổ cứng)
        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads/avatars/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String newFilename = UUID.randomUUID().toString() + extension;

                Path filePath = uploadPath.resolve(newFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String fileUrl = "http://localhost:8080/uploads/avatars/" + newFilename;
                profile.setAvatar(fileUrl);

            } catch (IOException e) {
                throw new RuntimeException("Lỗi không thể lưu file ảnh: " + e.getMessage());
            }
        }

        // 5. Lưu xuống DB và trả kết quả
        Profile updatedProfile = profileRepository.save(profile);
        return profileMapper.toProfileResponse(updatedProfile);
    }

    private Profile createNewProfile(User user) {
        Profile profile = new Profile();
        profile.setUser(user);

        if (user.getCreatedAt() != null) {
            profile.setHireDate(user.getCreatedAt().toLocalDate());
        } else {
            profile.setHireDate(LocalDate.now());
        }

        return profileRepository.save(profile);
    }
}