package com.fooddeliver.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Restaurant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    private String description;
    @Column(nullable = false) private String cuisine;
    private String imageUrl;
    private String coverImageUrl;
    @Column(nullable = false) private Double rating;
    @Column(nullable = false) private Integer deliveryTimeMin;
    @Column(nullable = false) private Integer deliveryTimeMax;
    @Column(nullable = false) private Double deliveryFee;
    @Column(nullable = false) private Double minOrder;
    private String address;
    private String city;
    private String ownerEmail;
    @Builder.Default private boolean isOpen = true;
    @Builder.Default private boolean isVeg = false;
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<MenuItem> menuItems = new ArrayList<>();
}