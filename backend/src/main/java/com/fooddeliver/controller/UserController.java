package com.fooddeliver.controller;

import com.fooddeliver.dto.request.AddressRequest;
import com.fooddeliver.dto.request.UpdateProfileRequest;
import com.fooddeliver.dto.response.AddressResponse;
import com.fooddeliver.dto.response.ApiResponse;
import com.fooddeliver.dto.response.UserResponse;
import com.fooddeliver.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", userService.getProfile(auth.getName())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(Authentication auth, @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(auth.getName(), request)));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Addresses fetched", userService.getAddresses(auth.getName())));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(Authentication auth, @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Address added", userService.addAddress(auth.getName(), request)));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(Authentication auth, @PathVariable Long id) {
        userService.deleteAddress(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
    }
}