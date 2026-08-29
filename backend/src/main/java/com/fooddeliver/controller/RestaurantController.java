package com.fooddeliver.controller;

import com.fooddeliver.dto.request.CreateMenuItemRequest;
import com.fooddeliver.dto.request.CreateRestaurantRequest;
import com.fooddeliver.dto.response.ApiResponse;
import com.fooddeliver.dto.response.MenuItemResponse;
import com.fooddeliver.dto.response.RestaurantResponse;
import com.fooddeliver.repository.CategoryRepository;
import com.fooddeliver.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final CategoryRepository categoryRepository;

    @GetMapping("/restaurants")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getRestaurants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Double minRating) {
        return ResponseEntity.ok(ApiResponse.success("Restaurants fetched", restaurantService.getRestaurants(search, cuisine, minRating)));
    }

    @GetMapping("/restaurants/my")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getMyRestaurant(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("My restaurant", restaurantService.getMyRestaurant(auth.getName())));
    }

    @PostMapping("/restaurants")
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(
            Authentication auth,
            @Valid @RequestBody CreateRestaurantRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant created successfully", restaurantService.createRestaurant(auth.getName(), request)));
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant details", restaurantService.getRestaurantById(id)));
    }

    @PostMapping("/restaurants/{id}/menu")
    public ResponseEntity<ApiResponse<MenuItemResponse>> addMenuItem(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody CreateMenuItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Dish added successfully", restaurantService.addMenuItem(auth.getName(), id, request)));
    }

    @GetMapping("/restaurants/{id}/menu/all")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getRestaurantMenuItems(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Menu items fetched", restaurantService.getRestaurantMenuItems(id)));
    }

    @PatchMapping("/restaurants/menu/{menuItemId}/toggle")
    public ResponseEntity<ApiResponse<MenuItemResponse>> toggleMenuItem(
            Authentication auth,
            @PathVariable Long menuItemId) {
        return ResponseEntity.ok(ApiResponse.success("Dish status updated", restaurantService.toggleMenuItemAvailability(auth.getName(), menuItemId)));
    }

    @DeleteMapping("/restaurants/menu/{menuItemId}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(
            Authentication auth,
            @PathVariable Long menuItemId) {
        restaurantService.deleteMenuItem(auth.getName(), menuItemId);
        return ResponseEntity.ok(ApiResponse.success("Dish deleted successfully"));
    }

    @GetMapping("/restaurants/dishes/search")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> searchDishes(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success("Dishes fetched", restaurantService.searchDishes(q)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<?>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories fetched", categoryRepository.findAll()));
    }
}