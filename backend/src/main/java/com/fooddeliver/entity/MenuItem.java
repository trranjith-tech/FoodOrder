package com.fooddeliver.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Restaurant restaurant;
    @Column(nullable = false) private String name;
    private String description;
    @Column(nullable = false) private Double price;
    private String imageUrl;
    @Column(nullable = false) private String category;
    @Builder.Default private boolean isVeg = false;
    @Builder.Default private boolean isAvailable = true;
    private Integer preparationTime;
    @Builder.Default private Double rating = 4.0;
}