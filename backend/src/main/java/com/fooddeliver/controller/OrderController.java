package com.fooddeliver.controller;

import com.fooddeliver.dto.request.ConfirmOrderRequest;
import com.fooddeliver.dto.request.CreateOrderRequest;
import com.fooddeliver.dto.response.ApiResponse;
import com.fooddeliver.dto.response.OrderResponse;
import com.fooddeliver.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(Authentication auth, @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Order created. Please confirm with OTP.", orderService.createOrder(auth.getName(), request)));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmOrder(Authentication auth, @PathVariable Long id, @Valid @RequestBody ConfirmOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Order confirmed", orderService.confirmOrder(auth.getName(), id, request.getOtp())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Orders fetched", orderService.getMyOrders(auth.getName())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order details", orderService.getOrderById(auth.getName(), id)));
    }

    @GetMapping("/restaurant")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersForRestaurant(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant orders fetched", orderService.getOrdersForRestaurant(auth.getName())));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody com.fooddeliver.dto.request.UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Order status updated", orderService.updateOrderStatus(auth.getName(), id, request.getStatus())));
    }
}