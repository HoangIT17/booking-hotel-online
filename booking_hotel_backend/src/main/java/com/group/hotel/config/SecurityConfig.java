package com.group.hotel.config;

import com.group.hotel.security.CustomAccessDeniedHandler;
import com.group.hotel.security.JwtAuthEntryPoint;
import com.group.hotel.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.web.filter.CorsFilter;

import java.util.List;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception
                        // Xử lý lỗi 401 (Chưa đăng nhập, Token sai/hết hạn)
                        .authenticationEntryPoint(jwtAuthEntryPoint)

                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/v1/auth/**").permitAll()

                        .requestMatchers("/api/v1/admin/furnitures/**").hasAnyAuthority("ADMIN","MANAGER")
                        .requestMatchers("/api/v1/manager/rooms/**").hasAnyAuthority("ADMIN","MANAGER")
                        .requestMatchers("/RoomImages/**").permitAll()


                        // Nếu sau này bạn có API dành riêng cho Admin thì khai báo ở đây, ví dụ:
                        .requestMatchers("/api/v1/users/**").hasAuthority("ADMIN")


                        .anyRequest().authenticated()
                );

        // Chèn filter kiểm tra Token vào trước filter xác thực mặc định
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter () {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 1. Cho phép đính kèm Cookie / Token Auth hệ Stateless
        config.setAllowCredentials(true);

        // 2. 🌟 Sử dụng Pattern để chấp nhận TẤT CẢ các cổng từ localhost
        config.setAllowedOriginPatterns(List.of("*"));

        // 3. Cho phép tất cả các Header (Authorization, Content-Type,...)
        config.setAllowedHeaders(List.of("*"));

        // 4. Định nghĩa tường minh các HTTP Methods theo yêu cầu của bạn
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Áp dụng cấu hình trên cho toàn bộ các endpoint API
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}