package com.fooddeliver.dto.response;
import lombok.*;
import java.util.List;
import java.util.Map;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RestaurantResponse {
    private Long id;
    private String name;
    private String description;
    private String cuisine;
    private String imageUrl;
    private String coverImageUrl;
    private Double rating;
    private Integer deliveryTimeMin;
    private Integer deliveryTimeMax;
    private Double deliveryFee;
    private Double minOrder;
    private String address;
    private String city;
    private boolean isOpen;
    private boolean isVeg;
    private String ownerEmail;
    private Map<String, List<MenuItemResponse>> menu;
}