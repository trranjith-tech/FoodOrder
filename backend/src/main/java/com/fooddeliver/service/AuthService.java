package com.fooddeliver.service;

import com.fooddeliver.dto.request.*;
import com.fooddeliver.dto.response.*;
import com.fooddeliver.entity.User;
import com.fooddeliver.entity.enums.OtpPurpose;
import com.fooddeliver.entity.enums.Role;
import com.fooddeliver.exception.AppException;
import com.fooddeliver.repository.UserRepository;
import com.fooddeliver.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initiateRegistration(RegisterRequest request) {
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (existingUser.isVerified()) {
                throw AppException.conflict("Email is already registered and verified. Please sign in.");
            }
            // User exists but is unverified: update details and re-send OTP
            existingUser.setName(request.getName());
            existingUser.setPhone(request.getPhone());
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
            if (request.getRole() != null) {
                existingUser.setRole(request.getRole());
            }
            userRepository.save(existingUser);
            otpService.generateAndSendOtp(existingUser.getEmail(), existingUser.getName(), OtpPurpose.REGISTER);
            return;
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw AppException.conflict("Phone number already exists with another account.");
        }

        // Create user with verified = false
        User newUser = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole() != null ? request.getRole() : Role.USER)
            .verified(false)
            .build();
        userRepository.save(newUser);

        otpService.generateAndSendOtp(newUser.getEmail(), newUser.getName(), OtpPurpose.REGISTER);
    }

    @Transactional
    public AuthResponse completeRegistration(String email, String rawOtp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> AppException.notFound("No registration found for email: " + email));

        if (user.isVerified()) {
            throw AppException.badRequest("Account is already verified. Please sign in.");
        }

        otpService.verifyOtp(email, rawOtp, OtpPurpose.REGISTER);

        user.setVerified(true);
        userRepository.save(user);

        log.info("Account successfully verified and activated for user: {}", email);

        String token = jwtUtil.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        return AuthResponse.builder()
            .token(token)
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .otpRequired(false)
            .message("Account verified and registered successfully!")
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw AppException.unauthorized("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> AppException.notFound("User not found"));

        // If email is NOT verified, do not issue JWT yet, trigger login OTP verification
        if (!user.isVerified()) {
            otpService.generateAndSendOtp(user.getEmail(), user.getName(), OtpPurpose.LOGIN);
            return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .otpRequired(true)
                .message("Email verification required. An OTP has been sent to your registered email.")
                .build();
        }

        // Email is verified: issue JWT directly
        String token = jwtUtil.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        return AuthResponse.builder()
            .token(token)
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .otpRequired(false)
            .message("Login successful")
            .build();
    }

    @Transactional
    public AuthResponse verifyLoginOtp(VerifyLoginOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> AppException.notFound("User not found with email: " + request.getEmail()));

        otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpPurpose.LOGIN);

        // Mark verified upon successful OTP login
        if (!user.isVerified()) {
            user.setVerified(true);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        return AuthResponse.builder()
            .token(token)
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .otpRequired(false)
            .message("Login successful")
            .build();
    }

    public void resendOtp(ResendOtpRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        String name = userOpt.map(User::getName).orElse("User");

        if (request.getPurpose() == OtpPurpose.REGISTER && userOpt.isPresent() && userOpt.get().isVerified()) {
            throw AppException.badRequest("Account is already verified. Please sign in.");
        }

        otpService.generateAndSendOtp(request.getEmail(), name, request.getPurpose());
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> AppException.notFound("User not found"));
        otpService.generateAndSendOtp(user.getEmail(), user.getName(), OtpPurpose.FORGOT_PASSWORD);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpPurpose.FORGOT_PASSWORD);
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> AppException.notFound("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> AppException.notFound("User not found"));
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .verified(user.isVerified())
            .addresses(user.getAddresses().stream().map(a -> AddressResponse.builder()
                .id(a.getId())
                .label(a.getLabel())
                .street(a.getStreet())
                .city(a.getCity())
                .state(a.getState())
                .pincode(a.getPincode())
                .isDefault(a.isDefault())
                .build()
            ).collect(Collectors.toList()))
            .build();
    }
}