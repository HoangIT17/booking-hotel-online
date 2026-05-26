package com.group.hotel.common.config;

import com.group.hotel.user.entity.Profile;
import com.group.hotel.user.entity.Role;
import com.group.hotel.user.entity.User;
import com.group.hotel.enums.RoleProvider;
import com.group.hotel.user.repository.RoleRepository;
import com.group.hotel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional // Đảm bảo chạy chung 1 phiên làm việc với DB để lưu cả User lẫn Profile
    public void run(String... args) throws Exception {

        // 1. Nếu bảng Roles trống -> Tạo 5 Roles mặc định
        if (roleRepository.count() == 0) {
            log.info("Bảng Roles đang trống. Tiến hành tạo dữ liệu mẫu...");
            List<Role> roles = List.of(
                    Role.builder().roleName("ADMIN").description("Quản trị viên hệ thống").build(),
                    Role.builder().roleName("MANAGER").description("Quản lý khách sạn").build(),
                    Role.builder().roleName("STAFF").description("Nhân viên buồng phòng").build(),
                    Role.builder().roleName("RECEPTIONIST").description("Nhân viên lễ tân").build(),
                    Role.builder().roleName("CUSTOMER").description("Khách hàng").build()
            );
            roleRepository.saveAll(roles);
            log.info("Đã khởi tạo thành công 5 Roles!");
        }

        // 2. Nếu bảng Users trống -> Tạo 5 tài khoản mẫu ứng với 5 Roles
        if (userRepository.count() == 0) {
            log.info("Bảng Users đang trống. Tiến hành tạo 5 tài khoản test...");

            // Lấy toàn bộ danh sách Roles vừa tạo lên để gán mối quan hệ
            List<Role> allRoles = roleRepository.findAll();

            Role adminRole = allRoles.stream().filter(r -> "ADMIN".equals(r.getRoleName())).findFirst().orElse(null);
            Role managerRole = allRoles.stream().filter(r -> "MANAGER".equals(r.getRoleName())).findFirst().orElse(null);
            Role staffRole = allRoles.stream().filter(r -> "STAFF".equals(r.getRoleName())).findFirst().orElse(null);
            Role receptionistRole = allRoles.stream().filter(r -> "RECEPTIONIST".equals(r.getRoleName())).findFirst().orElse(null);
            Role customerRole = allRoles.stream().filter(r -> "CUSTOMER".equals(r.getRoleName())).findFirst().orElse(null);

            // Mã hóa mật khẩu chung "123123" sang chuẩn BCrypt bảo mật
            String hashPassword = passwordEncoder.encode("123123");

            List<User> testUsers = new ArrayList<>();

            // Đóng gói data chuẩn chỉnh (Bao gồm cả User và Profile tương ứng)
            testUsers.add(helperCreateUser("admin", hashPassword, "admin@hotel.com", adminRole, "Quản Trị Viên"));
            testUsers.add(helperCreateUser("manager", hashPassword, "manager@hotel.com", managerRole, "Quản Lý Nguyễn"));
            testUsers.add(helperCreateUser("staff", hashPassword, "staff@hotel.com", staffRole, "Nhân Viên Trần"));
            testUsers.add(helperCreateUser("receptionist", hashPassword, "receptionist@hotel.com", receptionistRole, "Lễ Tân Lê"));
            testUsers.add(helperCreateUser("customer", hashPassword, "customer@hotel.com", customerRole, "Khách Hàng Hoàng"));

            // Lưu 1 phát ăn ngay cả 5 cụm tài khoản nhờ CascadeType.ALL
            userRepository.saveAll(testUsers);
            log.info("Khởi tạo thành công 5 tài khoản test! Tất cả mật khẩu đều là: 123123");
        }
    }

    /**
     * Hàm helper phụ trợ thiết lập nhanh mối quan hệ 2 chiều giữa User và Profile
     */
    private User helperCreateUser(String username, String encodedPassword, String email, Role role, String fullName) {
        User user = User.builder()
                .username(username)
                .password(encodedPassword)
                .email(email)
                .role(role)
                .provider(RoleProvider.LOCAL)
                .isActive(true)
                .build();

        Profile profile = Profile.builder()
                .fullName(fullName)
                .phone("098765432" + (int)(Math.random() * 10)) // Tạo số điện thoại ngẫu nhiên cho đẹp data
                .user(user)
                .build();

        user.setProfile(profile);
        return user;
    }
}