package com.fooddeliver.dto.request;

import com.fooddeliver.entity.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus status;
}
