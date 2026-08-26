package com.fooddeliver.dto.response;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantImageUrl;
    private String customerName;
    private String customerPhone;
    private List<OrderItemResponse> items;
    private String status;
    private Double subtotal;
    private Double deliveryFee;
    private Double total;
    private String deliveryAddress;
    private String specialInstructions;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime deliveredAt;
}