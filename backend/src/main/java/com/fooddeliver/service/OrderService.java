package com.fooddeliver.service;

import com.fooddeliver.dto.request.CreateOrderRequest;
import com.fooddeliver.dto.response.*;
import com.fooddeliver.entity.*;
import com.fooddeliver.entity.enums.OrderStatus;
import com.fooddeliver.entity.enums.OtpPurpose;
import com.fooddeliver.exception.AppException;
import com.fooddeliver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final AddressRepository addressRepository;
    private final OtpService otpService;

    @Transactional
    public OrderResponse createOrder(String email, CreateOrderRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
            .orElseThrow(() -> AppException.notFound("Restaurant not found"));
        Address address = addressRepository.findById(request.getAddressId())
            .orElseThrow(() -> AppException.notFound("Address not found"));
            
        if (!address.getUser().getId().equals(user.getId())) throw AppException.forbidden("Address doesn't belong to user");

        double subtotal = 0;
        Order order = Order.builder().user(user).restaurant(restaurant).status(OrderStatus.PENDING_OTP)
            .deliveryAddress(address.getStreet() + ", " + address.getCity()).specialInstructions(request.getSpecialInstructions())
            .build();
            
        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            MenuItem item = menuItemRepository.findById(itemReq.getMenuItemId())
                .orElseThrow(() -> AppException.notFound("Menu item not found"));
            subtotal += item.getPrice() * itemReq.getQuantity();
            order.getItems().add(OrderItem.builder().order(order).menuItem(item).name(item.getName())
                .price(item.getPrice()).quantity(itemReq.getQuantity()).build());
        }
        
        if (subtotal < restaurant.getMinOrder()) throw AppException.badRequest("Order below minimum amount");
        
        order.setSubtotal(subtotal);
        order.setDeliveryFee(restaurant.getDeliveryFee());
        order.setTotal(subtotal + restaurant.getDeliveryFee());
        
        order = orderRepository.save(order);
        otpService.generateAndSendOtp(email, user.getName(), OtpPurpose.ORDER, order.getId());
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse confirmOrder(String email, Long orderId, String otp) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
        Order order = orderRepository.findById(orderId).orElseThrow(() -> AppException.notFound("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) throw AppException.forbidden("Order doesn't belong to user");
        
        OtpRecord otpRecord = otpService.verifyOtp(email, otp, OtpPurpose.ORDER);
        if (otpRecord.getReferenceId() == null || !otpRecord.getReferenceId().equals(orderId)) {
            throw AppException.badRequest("OTP doesn't match this order");
        }
        
        order.setStatus(OrderStatus.CONFIRMED);
        order.setConfirmedAt(LocalDateTime.now());
        return mapToOrderResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getMyOrders(String email) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
            .map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public OrderResponse getOrderById(String email, Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> AppException.notFound("Order not found"));
        if (!order.getUser().getEmail().equals(email)) throw AppException.forbidden("Order doesn't belong to user");
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getOrdersForRestaurant(String ownerEmail) {
        Restaurant restaurant = restaurantRepository.findFirstByOwnerEmail(ownerEmail)
            .orElseThrow(() -> AppException.notFound("No restaurant registered for this owner account"));
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId()).stream()
            .map(this::mapToOrderResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(String ownerEmail, Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> AppException.notFound("Order not found"));
        if (order.getRestaurant().getOwnerEmail() != null && !order.getRestaurant().getOwnerEmail().equalsIgnoreCase(ownerEmail)) {
            throw AppException.forbidden("You do not have permission to manage this restaurant's orders");
        }
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        return mapToOrderResponse(orderRepository.save(order));
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
            .id(order.getId())
            .restaurantId(order.getRestaurant() != null ? order.getRestaurant().getId() : null)
            .restaurantName(order.getRestaurant() != null ? order.getRestaurant().getName() : null)
            .restaurantImageUrl(order.getRestaurant() != null ? order.getRestaurant().getImageUrl() : null)
            .customerName(order.getUser() != null ? order.getUser().getName() : null)
            .customerPhone(order.getUser() != null ? order.getUser().getPhone() : null)
            .status(order.getStatus().name())
            .subtotal(order.getSubtotal())
            .deliveryFee(order.getDeliveryFee())
            .total(order.getTotal())
            .deliveryAddress(order.getDeliveryAddress())
            .specialInstructions(order.getSpecialInstructions())
            .createdAt(order.getCreatedAt())
            .confirmedAt(order.getConfirmedAt())
            .deliveredAt(order.getDeliveredAt())
            .items(order.getItems().stream().map(i -> OrderItemResponse.builder()
                .id(i.getId())
                .name(i.getName())
                .quantity(i.getQuantity())
                .price(i.getPrice())
                .imageUrl(i.getMenuItem() != null ? i.getMenuItem().getImageUrl() : null)
                .build()
            ).collect(Collectors.toList()))
            .build();
    }
}