package com.group.hotel.service.impl;

import com.group.hotel.dto.request.ChangePasswordRequest;
import com.group.hotel.dto.request.LoginRequest;
import com.group.hotel.dto.request.RegisterRequest;
import com.group.hotel.dto.response.LoginResponse;
import com.group.hotel.entity.Profile;
import com.group.hotel.entity.Role;
import com.group.hotel.entity.User;
import com.group.hotel.enums.RoleProvider;
import com.group.hotel.exception.AppException;
import com.group.hotel.exception.ErrorCode; // Giả sử bạn có class này, nếu chưa thì ném RuntimeException
import com.group.hotel.mapper.AuthMapper;
import com.group.hotel.repository.RoleRepository;
import com.group.hotel.repository.UserRepository;
import com.group.hotel.security.JwtService;
import com.group.hotel.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthMapper authMapper;


    @Transactional
    @Override
    public void register(RegisterRequest request) {
        // 1. Kiểm tra trùng lặp
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2. Map và thiết lập
        User user = authMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider(RoleProvider.LOCAL);
        user.setIsActive(true);

        // 3. Gán quyền
        Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Không tìm thấy quyền CUSTOMER"));
        user.setRole(customerRole);

        // 4. Tạo Profile
        Profile profile = Profile.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .user(user)
                .build();
        user.setProfile(profile);

        // 5. Lưu (Không cần return)
        userRepository.save(user);
        log.info("Đăng ký thành công tài khoản: {}", user.getUsername());
    }

    @Transactional
    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. Tìm user dưới Database
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Chặn tài khoản bị khóa
        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_IS_LOCKED);
        }

        // 3. Tự tay kiểm tra mật khẩu (Cách bạn đề xuất)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        // 4. Nếu qua hết các ải trên -> Sinh Token
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // 5. Trả về Response
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole().getRoleName())
                .build();
    }


    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        // 1. Lấy ra User đang đăng nhập từ hệ thống Token
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Xác thực Mật khẩu cũ:
        // Dùng passwordEncoder.matches() để so sánh chuỗi người dùng gõ vào với chuỗi đã băm dưới DB
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.OLD_PASSWORD_INCORRECT); // Tự định nghĩa mã lỗi này nhé
        }

        // 3. Kiểm tra tính hợp lệ của Mật khẩu mới
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH); // Pass mới và xác nhận pass không khớp
        }

        // (Tùy chọn) 4. Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_CANNOT_BE_SAME);
        }

        // 5. Băm mật khẩu mới và lưu xuống Database
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }




}