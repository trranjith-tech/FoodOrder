package com.fooddeliver.dto.response;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MenuItemResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String category;
    private boolean isVeg;
    private boolean isAvailable;
    private Integer preparationTime;
    private Double rating;
    private Long restaurantId;
    private String restaurantName;
}