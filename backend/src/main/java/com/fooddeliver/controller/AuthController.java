package com.fooddeliver.controller;

import com.fooddeliver.dto.request.*;
import com.fooddeliver.dto.response.ApiResponse;
import com.fooddeliver.dto.response.AuthResponse;
import com.fooddeliver.service.AuthService;
import com.fooddeliver.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.initiateRegistration(request);
        return ResponseEntity.ok(ApiResponse.success("OTP sent to " + request.getEmail() + ". Please verify to complete registration."));
    }

    @PostMapping("/verify-registration-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyRegistrationOtp(@Valid @RequestBody VerifyRegistrationOtpRequest request) {
        AuthResponse auth = authService.completeRegistration(request.getEmail(), request.getOtp());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Account verified and created successfully!", auth));
    }

    // Retain backward compatibility with existing /verify-otp endpoint
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse auth = authService.completeRegistration(request.getEmail(), request.getOtp());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Account verified and created successfully!", auth));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse auth = authService.login(request);
        if (auth.isOtpRequired()) {
            return ResponseEntity.ok(ApiResponse.success("OTP verification required", auth));
        }
        return ResponseEntity.ok(ApiResponse.success("Login successful", auth));
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyLoginOtp(@Valid @RequestBody VerifyLoginOtpRequest request) {
        AuthResponse auth = authService.verifyLoginOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", auth));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Void>> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP resent successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("OTP sent to your email for password reset"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getCurrentUser(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("User details", authService.getCurrentUser(auth.getName())));
    }
}