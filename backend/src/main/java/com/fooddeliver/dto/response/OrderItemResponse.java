package com.fooddeliver.dto.response;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private String name;
    private Integer quantity;
    private Double price;
    private String imageUrl;
}