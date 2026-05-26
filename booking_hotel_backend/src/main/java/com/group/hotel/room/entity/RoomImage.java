package com.group.hotel.room.entity;

import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "room_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoomImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_thumbnail")
    private Boolean isThumbnail;
}
