package com.fooddeliver.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateRestaurantRequest {
    @NotBlank(message = "Restaurant name is required")
    private String name;
    private String description;
    @NotBlank(message = "Cuisine is required")
    private String cuisine;
    private String imageUrl;
    private String coverImageUrl;
    private Double deliveryFee = 30.0;
    private Double minOrder = 100.0;
    private Integer deliveryTimeMin = 25;
    private Integer deliveryTimeMax = 40;
    private String address;
    private String city;
    private boolean isVeg = false;
}
