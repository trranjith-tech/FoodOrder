package com.fooddeliver.service;

import com.fooddeliver.dto.request.CreateMenuItemRequest;
import com.fooddeliver.dto.request.CreateRestaurantRequest;
import com.fooddeliver.dto.response.*;
import com.fooddeliver.entity.MenuItem;
import com.fooddeliver.entity.Restaurant;
import com.fooddeliver.exception.AppException;
import com.fooddeliver.repository.MenuItemRepository;
import com.fooddeliver.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public List<RestaurantResponse> getRestaurants(String search, String cuisine, Double minRating) {
        return restaurantRepository.findAll().stream()
            .filter(r -> r.isOpen())
            .filter(r -> {
                if (search == null || search.isBlank()) return true;
                String s = search.toLowerCase();
                return (r.getName() != null && r.getName().toLowerCase().contains(s)) ||
                       (r.getCuisine() != null && r.getCuisine().toLowerCase().contains(s));
            })
            .filter(r -> {
                if (cuisine == null || cuisine.isBlank() || cuisine.equalsIgnoreCase("All")) return true;
                return r.getCuisine() != null && r.getCuisine().equalsIgnoreCase(cuisine);
            })
            .filter(r -> {
                if (minRating == null) return true;
                return r.getRating() != null && r.getRating() >= minRating;
            })
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant r = restaurantRepository.findById(id).orElseThrow(() -> AppException.notFound("Restaurant not found"));
        Map<String, List<MenuItemResponse>> menuMap = menuItemRepository.findByRestaurantIdAndIsAvailableTrue(id).stream()
            .map(this::mapToItemResponse)
            .collect(Collectors.groupingBy(MenuItemResponse::getCategory));
            
        RestaurantResponse resp = mapToResponse(r);
        resp.setMenu(menuMap);
        return resp;
    }

    public List<MenuItemResponse> searchDishes(String query) {
        if (query == null || query.isBlank()) return List.of();
        String q = query.trim().toLowerCase();
        return menuItemRepository.findAll().stream()
            .filter(m -> m.isAvailable() && (
                (m.getName() != null && m.getName().toLowerCase().contains(q)) ||
                (m.getCategory() != null && m.getCategory().toLowerCase().contains(q)) ||
                (m.getDescription() != null && m.getDescription().toLowerCase().contains(q))
            ))
            .map(this::mapToItemResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public RestaurantResponse createRestaurant(String ownerEmail, CreateRestaurantRequest request) {
        Restaurant restaurant = Restaurant.builder()
            .name(request.getName())
            .description(request.getDescription())
            .cuisine(request.getCuisine())
            .imageUrl(request.getImageUrl() != null && !request.getImageUrl().isBlank() ? request.getImageUrl() : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80")
            .coverImageUrl(request.getCoverImageUrl() != null && !request.getCoverImageUrl().isBlank() ? request.getCoverImageUrl() : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80")
            .deliveryFee(request.getDeliveryFee() != null ? request.getDeliveryFee() : 30.0)
            .minOrder(request.getMinOrder() != null ? request.getMinOrder() : 100.0)
            .deliveryTimeMin(request.getDeliveryTimeMin() != null ? request.getDeliveryTimeMin() : 25)
            .deliveryTimeMax(request.getDeliveryTimeMax() != null ? request.getDeliveryTimeMax() : 40)
            .address(request.getAddress())
            .city(request.getCity())
            .ownerEmail(ownerEmail)
            .isVeg(request.isVeg())
            .rating(4.5)
            .isOpen(true)
            .build();
        return mapToResponse(restaurantRepository.save(restaurant));
    }

    public RestaurantResponse getMyRestaurant(String ownerEmail) {
        return restaurantRepository.findFirstByOwnerEmail(ownerEmail)
            .map(this::mapToResponse)
            .orElse(null);
    }

    @Transactional
    public MenuItemResponse addMenuItem(String ownerEmail, Long restaurantId, CreateMenuItemRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> AppException.notFound("Restaurant not found"));
        if (restaurant.getOwnerEmail() != null && !restaurant.getOwnerEmail().equalsIgnoreCase(ownerEmail)) {
            throw AppException.forbidden("You do not own this restaurant");
        }
        MenuItem item = MenuItem.builder()
            .restaurant(restaurant)
            .name(request.getName())
            .description(request.getDescription())
            .price(request.getPrice())
            .imageUrl(request.getImageUrl() != null && !request.getImageUrl().isBlank() ? request.getImageUrl() : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80")
            .category(request.getCategory())
            .isVeg(request.isVeg())
            .isAvailable(request.isAvailable())
            .preparationTime(request.getPreparationTime() != null ? request.getPreparationTime() : 20)
            .rating(4.5)
            .build();
        return mapToItemResponse(menuItemRepository.save(item));
    }

    public List<MenuItemResponse> getRestaurantMenuItems(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
            .map(this::mapToItemResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public MenuItemResponse toggleMenuItemAvailability(String ownerEmail, Long menuItemId) {
        MenuItem item = menuItemRepository.findById(menuItemId)
            .orElseThrow(() -> AppException.notFound("Item not found"));
        if (item.getRestaurant().getOwnerEmail() != null && !item.getRestaurant().getOwnerEmail().equalsIgnoreCase(ownerEmail)) {
            throw AppException.forbidden("You do not own this restaurant");
        }
        item.setAvailable(!item.isAvailable());
        return mapToItemResponse(menuItemRepository.save(item));
    }

    @Transactional
    public void deleteMenuItem(String ownerEmail, Long menuItemId) {
        MenuItem item = menuItemRepository.findById(menuItemId)
            .orElseThrow(() -> AppException.notFound("Item not found"));
        if (item.getRestaurant().getOwnerEmail() != null && !item.getRestaurant().getOwnerEmail().equalsIgnoreCase(ownerEmail)) {
            throw AppException.forbidden("You do not own this restaurant");
        }
        menuItemRepository.delete(item);
    }

    private RestaurantResponse mapToResponse(Restaurant r) {
        return RestaurantResponse.builder()
            .id(r.getId())
            .name(r.getName())
            .description(r.getDescription())
            .cuisine(r.getCuisine())
            .imageUrl(r.getImageUrl())
            .coverImageUrl(r.getCoverImageUrl())
            .rating(r.getRating())
            .deliveryTimeMin(r.getDeliveryTimeMin())
            .deliveryTimeMax(r.getDeliveryTimeMax())
            .deliveryFee(r.getDeliveryFee())
            .minOrder(r.getMinOrder())
            .address(r.getAddress())
            .city(r.getCity())
            .ownerEmail(r.getOwnerEmail())
            .isOpen(r.isOpen())
            .isVeg(r.isVeg())
            .build();
    }

    private MenuItemResponse mapToItemResponse(MenuItem m) {
        return MenuItemResponse.builder()
            .id(m.getId())
            .name(m.getName())
            .description(m.getDescription())
            .price(m.getPrice())
            .imageUrl(m.getImageUrl())
            .category(m.getCategory())
            .isVeg(m.isVeg())
            .isAvailable(m.isAvailable())
            .preparationTime(m.getPreparationTime())
            .rating(m.getRating())
            .restaurantId(m.getRestaurant() != null ? m.getRestaurant().getId() : null)
            .restaurantName(m.getRestaurant() != null ? m.getRestaurant().getName() : null)
            .build();
    }
}