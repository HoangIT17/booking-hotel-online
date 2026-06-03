package com.group.hotel.config;

import com.group.hotel.security.CustomAccessDeniedHandler;
import com.group.hotel.security.JwtAuthEntryPoint;
import com.group.hotel.security.JwtAuthenticationFilter;
import com.group.hotel.security.OAuth2LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

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

                // 🌟 1. LIÊN KẾT CORS TRỰC TIẾP VỚI SPRING SECURITY

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler)
                )

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ── CORS preflight ─────────────────────────────────────────────────
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ── Auth & OAuth2 ──────────────────────────────────────────────────
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/code/**").permitAll()

                        // ── Static files ───────────────────────────────────────────────────
                        .requestMatchers("/uploads/**", "/RoomImages/**").permitAll()

                        // ── Public APIs ────────────────────────────────────────────────────
                        .requestMatchers(HttpMethod.GET,  "/api/v1/reviews").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/v1/customer/rooms/search/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/v1/payments/vnpay/return").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/v1/customer/vouchers/available").permitAll()

                        // ── Customer ───────────────────────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/v1/chatbot/ask").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/reservation-create").hasAuthority("CUSTOMER")
                        .requestMatchers("/api/v1/customer/**").hasAnyAuthority("CUSTOMER", "ADMIN")

                        // ── Staff + Receptionist + Admin + Manager ─────────────────────────
                        .requestMatchers("/api/v1/staff/**").hasAnyAuthority("STAFF", "RECEPTIONIST", "ADMIN", "MANAGER")

                        // ── Receptionist + Admin + Manager ─────────────────────────────────
                        .requestMatchers("/api/v1/receptionist/**").hasAnyAuthority("RECEPTIONIST", "ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/api/v1/manager/reservation-search").hasAnyAuthority("RECEPTIONIST", "ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/manager/reservation-update").hasAnyAuthority("ADMIN", "MANAGER")

                        // ── Incidents: Staff + Receptionist + Admin + Manager ──────────────
                        .requestMatchers("/api/v1/incidents/**").hasAnyAuthority("STAFF", "RECEPTIONIST", "ADMIN", "MANAGER")

                        // ── Reviews management ─────────────────────────────────────────────
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/reviews/**").hasAnyAuthority("RECEPTIONIST", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/reviews/**").hasAnyAuthority("STAFF", "RECEPTIONIST", "MANAGER", "ADMIN")

                        // ── Admin + Manager ────────────────────────────────────────────────
                        .requestMatchers("/api/v1/furnitures/**").hasAnyAuthority("ADMIN", "MANAGER")
                        .requestMatchers("/api/v1/rooms/**").hasAnyAuthority("ADMIN", "MANAGER")
                        .requestMatchers("/api/v1/vouchers/**").hasAnyAuthority("ADMIN", "MANAGER")
                        .requestMatchers("/api/v1/maintenance/**").hasAnyAuthority("ADMIN", "MANAGER")
                        .requestMatchers("/api/v1/chatbot/**").hasAnyAuthority("ADMIN", "MANAGER")

                        // ── Admin only ─────────────────────────────────────────────────────
                        .requestMatchers("/api/v1/users/**").hasAuthority("ADMIN")

                        // ── Any authenticated user (profile, payments...) ──────────────────
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler)
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🌟 2. CẤU HÌNH CORS CHUẨN TỪNG MILIMET CHO SPRING SECURITY 6
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
