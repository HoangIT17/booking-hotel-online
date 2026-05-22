package com.group.hotel.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "furniture_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FurnitureImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "furniture_id")
    private Furniture furniture;

    @Column(name = "image_url", length = 255)
    private String imageUrl;
}
