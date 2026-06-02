package com.group.hotel.service.impl;

import com.group.hotel.dto.request.user.UserCreateRequest;
import com.group.hotel.dto.request.user.UserUpdateRequest;
import com.group.hotel.dto.response.user.UserCreateResponse;
import com.group.hotel.dto.response.user.UserResponse;
import com.group.hotel.entity.Profile;
import com.group.hotel.entity.Role;
import com.group.hotel.entity.User;
import com.group.hotel.enums.RoleProvider;
import com.group.hotel.exception.AppException;
import com.group.hotel.exception.ErrorCode;
import com.group.hotel.mapper.UserMapper;
import com.group.hotel.repository.RoleRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.service.UserService;
import com.group.hotel.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserCreateResponse createUser(UserCreateRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        // Nhờ Mapper sinh dữ liệu tự động, code cực kỳ gọn
        User user = userMapper.toUser(request);
        Profile profile = userMapper.toProfile(request);

        // Bổ sung các logic nghiệp vụ đặc thù
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setProvider(RoleProvider.LOCAL);
        user.setIsActive(true);

        // Kết nối 2 bảng với nhau (Do dùng CascadeType.ALL ở Entity)
        profile.setUser(user);
        user.setProfile(profile);

        // Lưu 1 phát ăn ngay cả User lẫn Profile
        user = userRepository.save(user);

        return UserCreateResponse.builder()
                .message("Account created successfully!")
                .userId(user.getId())
                .build();
    }

    @Override
    public Page<UserResponse> getAllUsers(int page, int size, String keyword, String role, Boolean isActive, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<User> spec = UserSpecification.filterUsers(keyword, role, isActive);

        Page<User> users = userRepository.findAll(spec, pageable);
        return users.map(userMapper::toUserResponse);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        return userMapper.toUserResponse(user);
    }


    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Update dữ liệu cơ bản
        userMapper.updateUserFromRequest(request, user);

        // Cập nhật Profile
        if (user.getProfile() != null) {
            user.getProfile().setFullName(request.getFullName());
            user.getProfile().setPhone(request.getPhone());
        }

        // Cập nhật Role nếu có truyền lên
        if (request.getRoleId() != null) {
            Role newRole = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Quyền không tồn tại"));
            user.setRole(newRole);
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        if ("ADMIN".equalsIgnoreCase(user.getRole().getRoleName())) {
            throw new RuntimeException("Không thể xóa tài khoản có quyền Quản trị viên (ADMIN)!");
        }
        // Xóa cứng hoàn toàn khỏi Database
        userRepository.delete(user);
        log.info("Admin đã xóa sổ hoàn toàn tài khoản: {}", user.getUsername());
    }
}