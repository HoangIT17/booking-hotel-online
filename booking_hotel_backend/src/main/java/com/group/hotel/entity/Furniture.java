package com.group.hotel.entity;

import com.group.hotel.enums.FurnitureType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "furniture")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Furniture {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "furniture_name", length = 100)
    private String furnitureName;

    @Enumerated(EnumType.STRING)
    @Column(name = "furniture_type")
    private FurnitureType furnitureType;

    @Column(name = "icon_name", length = 100)
    private String iconName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
