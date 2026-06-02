package com.group.hotel.security;

import com.group.hotel.entity.Role;
import com.group.hotel.entity.User;
import com.group.hotel.enums.RoleProvider; // Đảm bảo import đúng Enum
import com.group.hotel.repository.RoleRepository;
import com.group.hotel.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        String registrationId = authToken.getAuthorizedClientRegistrationId(); // "google" hoặc "facebook"
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email;
        String fullName;
        String avatarUrl;
        String providerId;
        RoleProvider provider;

        // 1. Phân tách dữ liệu dựa trên Provider
        if ("google".equalsIgnoreCase(registrationId)) {
            email = oAuth2User.getAttribute("email");
            fullName = oAuth2User.getAttribute("name");
            avatarUrl = oAuth2User.getAttribute("picture");
            providerId = oAuth2User.getAttribute("sub");
            provider = RoleProvider.GOOGLE;
        } else {
            // Xử lý cho Facebook
            email = oAuth2User.getAttribute("email");
            fullName = oAuth2User.getAttribute("name");
            providerId = oAuth2User.getAttribute("id");
            provider = RoleProvider.FB; // Đảm bảo bạn đã thêm giá trị FACEBOOK vào Enum RoleProvider

            // Facebook trả ảnh ở: picture -> data -> url
            Map<String, Object> picture = oAuth2User.getAttribute("picture");
            if (picture != null) {
                Map<String, Object> data = (Map<String, Object>) picture.get("data");
                if (data != null) {
                    avatarUrl = (String) data.get("url");
                } else {
                    avatarUrl = null;
                }
            } else {
                avatarUrl = null;
            }
        }

        // 2. Kiểm tra và Lưu User vào Database
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(email);
            newUser.setProvider(provider);
            newUser.setProviderId(providerId);

            // Gán Role
            Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role CUSTOMER"));
            newUser.setRole(customerRole);

            // Xử lý Profile
            com.group.hotel.entity.Profile newProfile = new com.group.hotel.entity.Profile();
            newProfile.setFullName((fullName != null && !fullName.isEmpty()) ? fullName : email.substring(0, email.indexOf("@")));
            newProfile.setAvatar(avatarUrl);

            newUser.setProfile(newProfile);
            newProfile.setUser(newUser);

            return userRepository.save(newUser);
        });

        // 3. Tạo Token và Redirect
        String accessToken = jwtService.generateAccessToken(user);
        String targetUrl = frontendUrl + "/login-success?token=" + accessToken;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}