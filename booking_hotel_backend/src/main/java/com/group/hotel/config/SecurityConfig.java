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
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/RoomImages/**").permitAll()

                        .requestMatchers("/api/v1/maintenance/**").hasAnyAuthority("STAFF", "ADMIN", "MANAGER")
                        .requestMatchers("/api/v1/users/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/v1/staff/**").hasAnyAuthority("STAFF", "ADMIN", "MANAGER","RECEPTIONIST")
                        .requestMatchers("/api/v1/incidents/**").hasAnyAuthority("ADMIN", "MANAGER", "STAFF")


                        // Nếu sau này bạn có API dành riêng cho Admin thì khai báo ở đây, ví dụ:
                        .requestMatchers("/api/v1/users/**").hasAuthority("ADMIN")


                        .anyRequest().authenticated()
                );

        // Chèn filter kiểm tra Token vào trước filter xác thực mặc định
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép URL chạy ứng dụng Frontend của bạn
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // Cho phép đầy đủ mọi phương thức HTTP phổ biến
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Cho phép gửi kèm tất cả các Header cần thiết (bao gồm Authorization token nếu có)
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}