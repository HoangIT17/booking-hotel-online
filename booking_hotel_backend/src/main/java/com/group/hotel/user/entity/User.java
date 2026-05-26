package com.group.hotel.user.entity;

import com.group.hotel.enums.RoleProvider;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 255)
    private String password;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private RoleProvider provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "is_active")
    private Boolean isActive;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Profile profile;



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Biến quyền trong Database thành quyền mà Spring Security hiểu được
        return List.of(new SimpleGrantedAuthority(role.getRoleName()));
    }

    // ĐÂY RỒI! Hàm thần thánh chặn người dùng bị khóa đăng nhập
    @Override
    public boolean isEnabled() {
        // Đề phòng trường hợp isActive dưới database đang bị NULL thì mặc định là false
        return this.isActive != null ? this.isActive : false;
    }

    // 3 Hàm dưới đây cứ để mặc định là true (Không hết hạn, không bị khóa cứng bới hệ thống, mật khẩu không hết hạn)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}