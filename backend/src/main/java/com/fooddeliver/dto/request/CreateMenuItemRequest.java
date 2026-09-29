package com.fooddeliver.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateMenuItemRequest {
    @NotBlank(message = "Item name is required")
    private String name;
    private String description;
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    private String imageUrl;
    @NotBlank(message = "Category is required")
    private String category;
    private boolean isVeg = false;
    private boolean isAvailable = true;
    private Integer preparationTime = 20;
}
