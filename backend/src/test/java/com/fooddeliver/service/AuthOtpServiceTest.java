package com.fooddeliver.service;

import com.fooddeliver.dto.request.LoginRequest;
import com.fooddeliver.dto.request.RegisterRequest;
import com.fooddeliver.dto.request.ResendOtpRequest;
import com.fooddeliver.dto.request.VerifyLoginOtpRequest;
import com.fooddeliver.dto.response.AuthResponse;
import com.fooddeliver.entity.OtpRecord;
import com.fooddeliver.entity.User;
import com.fooddeliver.entity.enums.OtpPurpose;
import com.fooddeliver.entity.enums.Role;
import com.fooddeliver.exception.AppException;
import com.fooddeliver.repository.OtpRepository;
import com.fooddeliver.repository.UserRepository;
import com.fooddeliver.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class AuthOtpServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OtpRepository otpRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserDetailsService userDetailsService;

    private OtpService otpService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        otpService = new OtpService(otpRepository, emailService, passwordEncoder);
        authService = new AuthService(userRepository, authenticationManager, jwtUtil, userDetailsService, otpService, passwordEncoder);
    }

    @Test
    @DisplayName("Registration - successful registration creates unverified user and sends OTP")
    void testRegistrationSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice");
        request.setEmail("alice@test.com");
        request.setPhone("9876543210");
        request.setPassword("Password123");

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.empty());
        when(userRepository.existsByPhone("9876543210")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$hashedPassword");
        when(otpRepository.countByEmailAndPurposeAndCreatedAtAfter(anyString(), any(), any())).thenReturn(0L);

        authService.initiateRegistration(request);

        verify(userRepository).save(argThat(u -> 
            u.getEmail().equals("alice@test.com") && 
            !u.isVerified() &&
            u.getRole() == Role.USER
        ));
        verify(emailService).sendOtpEmail(eq("alice@test.com"), anyString(), eq("REGISTER"), eq("Alice"));
    }

    @Test
    @DisplayName("Registration - duplicate verified email throws conflict exception")
    void testRegistrationDuplicateVerifiedEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("alice@test.com");

        User verifiedUser = User.builder()
            .email("alice@test.com")
            .verified(true)
            .build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(verifiedUser));

        AppException ex = assertThrows(AppException.class, () -> authService.initiateRegistration(request));
        assertTrue(ex.getMessage().contains("already registered and verified"));
    }

    @Test
    @DisplayName("Registration - existing unverified email updates user and resends OTP")
    void testRegistrationUnverifiedResends() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice Updated");
        request.setEmail("alice@test.com");
        request.setPhone("9876543210");
        request.setPassword("NewPassword123");

        User unverifiedUser = User.builder()
            .email("alice@test.com")
            .name("Alice")
            .phone("9876543210")
            .verified(false)
            .build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(unverifiedUser));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$hashedNewPassword");
        when(otpRepository.countByEmailAndPurposeAndCreatedAtAfter(anyString(), any(), any())).thenReturn(0L);

        authService.initiateRegistration(request);

        verify(userRepository).save(unverifiedUser);
        assertEquals("Alice Updated", unverifiedUser.getName());
        verify(emailService).sendOtpEmail(eq("alice@test.com"), anyString(), eq("REGISTER"), eq("Alice Updated"));
    }

    @Test
    @DisplayName("Registration OTP verification - successful verification activates user and returns token")
    void testVerifyRegistrationOtpSuccess() {
        User user = User.builder()
            .id(1L)
            .name("Alice")
            .email("alice@test.com")
            .phone("9876543210")
            .role(Role.USER)
            .verified(false)
            .build();

        OtpRecord otpRecord = OtpRecord.builder()
            .email("alice@test.com")
            .otp("$2a$12$hashed123456")
            .purpose(OtpPurpose.REGISTER)
            .expiresAt(LocalDateTime.now().plusMinutes(5))
            .used(false)
            .attempts(0)
            .build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(user));
        when(otpRepository.findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc("alice@test.com", OtpPurpose.REGISTER))
            .thenReturn(Optional.of(otpRecord));
        when(passwordEncoder.matches(eq("123456"), eq("$2a$12$hashed123456"))).thenReturn(true);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("alice@test.com")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("mockJwtToken");

        AuthResponse response = authService.completeRegistration("alice@test.com", "123456");

        assertTrue(user.isVerified());
        assertTrue(otpRecord.isUsed());
        assertEquals("mockJwtToken", response.getToken());
        assertFalse(response.isOtpRequired());
    }

    @Test
    @DisplayName("Registration OTP verification - incorrect OTP increments attempts and throws error")
    void testVerifyRegistrationOtpIncorrect() {
        User user = User.builder()
            .email("alice@test.com")
            .verified(false)
            .build();

        OtpRecord otpRecord = OtpRecord.builder()
            .email("alice@test.com")
            .otp("$2a$12$hashed123456")
            .purpose(OtpPurpose.REGISTER)
            .expiresAt(LocalDateTime.now().plusMinutes(5))
            .used(false)
            .attempts(1)
            .build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(user));
        when(otpRepository.findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc("alice@test.com", OtpPurpose.REGISTER))
            .thenReturn(Optional.of(otpRecord));
        when(passwordEncoder.matches(eq("999999"), eq("$2a$12$hashed123456"))).thenReturn(false);

        AppException ex = assertThrows(AppException.class, () -> 
            authService.completeRegistration("alice@test.com", "999999"));

        assertTrue(ex.getMessage().contains("Invalid OTP"));
        assertEquals(2, otpRecord.getAttempts());
        verify(otpRepository).save(otpRecord);
    }

    @Test
    @DisplayName("Registration OTP verification - expired OTP throws error")
    void testVerifyRegistrationOtpExpired() {
        User user = User.builder()
            .email("alice@test.com")
            .verified(false)
            .build();

        OtpRecord otpRecord = OtpRecord.builder()
            .email("alice@test.com")
            .otp("$2a$12$hashed123456")
            .purpose(OtpPurpose.REGISTER)
            .expiresAt(LocalDateTime.now().minusMinutes(1))
            .used(false)
            .attempts(0)
            .build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(user));
        when(otpRepository.findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc("alice@test.com", OtpPurpose.REGISTER))
            .thenReturn(Optional.of(otpRecord));

        AppException ex = assertThrows(AppException.class, () -> 
            authService.completeRegistration("alice@test.com", "123456"));

        assertTrue(ex.getMessage().contains("expired"));
        assertTrue(otpRecord.isUsed());
    }

    @Test
    @DisplayName("Login - verified email issues JWT directly")
    void testLoginVerifiedDirectJwt() {
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@test.com");
        request.setPassword("Password123");

        User user = User.builder()
            .id(1L)
            .name("Alice")
            .email("alice@test.com")
            .phone("9876543210")
            .role(Role.USER)
            .verified(true)
            .build();

        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(user));
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("alice@test.com")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("jwtToken123");

        AuthResponse response = authService.login(request);

        assertFalse(response.isOtpRequired());
        assertEquals("jwtToken123", response.getToken());
        verify(emailService, never()).sendOtpEmail(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Login - unverified email sends Login OTP and returns otpRequired=true")
    void testLoginUnverifiedRequiresOtp() {
        LoginRequest request = new LoginRequest();
        request.setEmail("unverified@test.com");
        request.setPassword("Password123");

        User user = User.builder()
            .id(2L)
            .name("Bob")
            .email("unverified@test.com")
            .phone("9876543211")
            .role(Role.USER)
            .verified(false)
            .build();

        when(userRepository.findByEmail("unverified@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$hashedLoginOtp");
        when(otpRepository.countByEmailAndPurposeAndCreatedAtAfter(anyString(), any(), any())).thenReturn(0L);

        AuthResponse response = authService.login(request);

        assertTrue(response.isOtpRequired());
        assertNull(response.getToken());
        verify(emailService).sendOtpEmail(eq("unverified@test.com"), anyString(), eq("LOGIN"), eq("Bob"));
    }

    @Test
    @DisplayName("Login - invalid password throws unauthorized exception")
    void testLoginInvalidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@test.com");
        request.setPassword("WrongPassword");

        doThrow(new BadCredentialsException("Bad credentials"))
            .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        AppException ex = assertThrows(AppException.class, () -> authService.login(request));
        assertTrue(ex.getMessage().contains("Invalid email or password"));
    }

    @Test
    @DisplayName("Login OTP verification - successful verification issues JWT and marks user verified")
    void testVerifyLoginOtpSuccess() {
        VerifyLoginOtpRequest request = new VerifyLoginOtpRequest();
        request.setEmail("bob@test.com");
        request.setOtp("654321");

        User user = User.builder()
            .id(2L)
            .name("Bob")
            .email("bob@test.com")
            .phone("9876543211")
            .role(Role.USER)
            .verified(false)
            .build();

        OtpRecord otpRecord = OtpRecord.builder()
            .email("bob@test.com")
            .otp("$2a$12$hashed654321")
            .purpose(OtpPurpose.LOGIN)
            .expiresAt(LocalDateTime.now().plusMinutes(5))
            .used(false)
            .attempts(0)
            .build();

        when(userRepository.findByEmail("bob@test.com")).thenReturn(Optional.of(user));
        when(otpRepository.findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc("bob@test.com", OtpPurpose.LOGIN))
            .thenReturn(Optional.of(otpRecord));
        when(passwordEncoder.matches(eq("654321"), eq("$2a$12$hashed654321"))).thenReturn(true);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("bob@test.com")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("loginJwtToken");

        AuthResponse response = authService.verifyLoginOtp(request);

        assertTrue(user.isVerified());
        assertTrue(otpRecord.isUsed());
        assertEquals("loginJwtToken", response.getToken());
        assertFalse(response.isOtpRequired());
    }

    @Test
    @DisplayName("Resend OTP - invalidates old OTP and sends new one")
    void testResendOtpInvalidatesOld() {
        ResendOtpRequest request = new ResendOtpRequest();
        request.setEmail("bob@test.com");
        request.setPurpose(OtpPurpose.REGISTER);

        User user = User.builder()
            .email("bob@test.com")
            .name("Bob")
            .verified(false)
            .build();

        OtpRecord oldOtp = OtpRecord.builder()
            .email("bob@test.com")
            .otp("$2a$12$oldHashedOtp")
            .purpose(OtpPurpose.REGISTER)
            .used(false)
            .createdAt(LocalDateTime.now().minusMinutes(1))
            .build();

        when(userRepository.findByEmail("bob@test.com")).thenReturn(Optional.of(user));
        when(otpRepository.countByEmailAndPurposeAndCreatedAtAfter(anyString(), any(), any())).thenReturn(0L);
        when(otpRepository.findByEmailAndPurpose("bob@test.com", OtpPurpose.REGISTER)).thenReturn(List.of(oldOtp));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$newHashedOtp");

        authService.resendOtp(request);

        assertTrue(oldOtp.isUsed());
        verify(emailService).sendOtpEmail(eq("bob@test.com"), anyString(), eq("REGISTER"), eq("Bob"));
    }

    @Test
    @DisplayName("Resend OTP - rate limiting enforces cooldown on too many requests")
    void testResendOtpRateLimiting() {
        ResendOtpRequest request = new ResendOtpRequest();
        request.setEmail("bob@test.com");
        request.setPurpose(OtpPurpose.REGISTER);

        when(userRepository.findByEmail("bob@test.com")).thenReturn(Optional.of(User.builder().name("Bob").build()));
        when(otpRepository.countByEmailAndPurposeAndCreatedAtAfter(anyString(), any(), any())).thenReturn(3L);

        AppException ex = assertThrows(AppException.class, () -> authService.resendOtp(request));
        assertTrue(ex.getMessage().contains("Too many OTP requests"));
    }
}
