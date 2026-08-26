package com.fooddeliver.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
@Data
public class CreateOrderRequest {
    @NotNull private Long restaurantId;
    @NotEmpty private List<OrderItemRequest> items;
    @NotNull private Long addressId;
    private String specialInstructions;
    @Data
    public static class OrderItemRequest {
        @NotNull private Long menuItemId;
        @NotNull @Min(1) private Integer quantity;
    }
}