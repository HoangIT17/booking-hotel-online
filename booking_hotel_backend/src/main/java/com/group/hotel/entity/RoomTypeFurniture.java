package com.group.hotel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "room_type_furniture")
@Getter
@Setter
public class RoomTypeFurniture {

    @Id
    private Long id;

    // Loại phòng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    // Nội thất
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "furniture_id")
    private Furniture furniture;

    @Column(name = "quantity")
    private Integer quantity;
}