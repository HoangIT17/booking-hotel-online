package com.group.hotel.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "room_type_furniture")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoomTypeFurniture {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "furniture_id")
    private Furniture furniture;

    private Integer quantity;
}
