package com.group.hotel.service.impl;

import com.group.hotel.dto.request.user.ProfileUpdateRequest;
import com.group.hotel.dto.response.user.ProfileResponse;
import com.group.hotel.entity.Profile;
import com.group.hotel.entity.User;
import com.group.hotel.exception.AppException;
import com.group.hotel.exception.ErrorCode;
import com.group.hotel.mapper.ProfileMapper;
import com.group.hotel.repository.ProfileRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.service.ProfileService;
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

        // 1. Nhờ Mapper làm những phần text cơ bản
        ProfileResponse response = profileMapper.toProfileResponse(profile);

        // 2. 🌟 TỰ TAY BƠM DỮ LIỆU ĐẶC THÙ BẰNG JAVA THUẦN (1000% ĂN CODE)
        if (profile.getUser() != null && profile.getUser().getRole() != null) {
            String roleName = profile.getUser().getRole().getRoleName().toUpperCase();

            boolean isEmployee = roleName.contains("STAFF")
                    || roleName.contains("MANAGER")
                    || roleName.contains("RECEPTIONIST")
                    || roleName.contains("ADMIN");

            if (isEmployee) {
                // Đẩy số năm kinh nghiệm (nếu null thì cho bằng 0)
                response.setExperienceYears(profile.getExperienceYears() != null ? profile.getExperienceYears() : 0);

                // Đẩy kỹ năng (nếu null thì báo chưa thiết lập)
                response.setSkills((profile.getSkills() != null && !profile.getSkills().trim().isEmpty())
                        ? profile.getSkills() : "Chưa thiết lập kỹ năng");

                // Ưu tiên ngày trong bảng Profile, nếu trống bốc thẳng ngày tạo User
                if (profile.getHireDate() != null) {
                    response.setHireDate(profile.getHireDate());
                } else if (profile.getUser().getCreatedAt() != null) {
                    response.setHireDate(profile.getUser().getCreatedAt().toLocalDate());
                }
            } else {
                // Nếu là CUSTOMER thì ép về null để @JsonInclude nó xóa khỏi cục JSON
                response.setExperienceYears(null);
                response.setSkills(null);
                response.setHireDate(null);
            }
        }

        return response;
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

        // 2. Map dữ liệu Text cơ bản (fullName, phone, gender, birthday, address)
        profileMapper.updateProfileFromRequest(request, profile);

        // 3. Phân quyền Update trường đặc thù (🌟 ĐÃ ĐỒNG BỘ CẢ ADMIN VÀ ÉP CHỮ HOA)
        if (profile.getUser() != null && profile.getUser().getRole() != null) {
            String roleName = profile.getUser().getRole().getRoleName().toUpperCase();
            List<String> employeeRoles = List.of("STAFF", "MANAGER", "RECEPTIONIST", "ADMIN");

            if (employeeRoles.contains(roleName)) {
                profile.setExperienceYears(request.getExperienceYears());
                profile.setSkills(request.getSkills());
            }
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

        // 5. Lưu xuống DB và trả kết quả đi qua bộ lọc của Mapper phiên bản mới
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