package com.fooddeliver.service;

import com.fooddeliver.entity.OtpRecord;
import com.fooddeliver.entity.enums.OtpPurpose;
import com.fooddeliver.exception.AppException;
import com.fooddeliver.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    public void generateAndSendOtp(String email, String name, OtpPurpose purpose) {
        generateAndSendOtp(email, name, purpose, null);
    }

    public void generateAndSendOtp(String email, String name, OtpPurpose purpose, Long referenceId) {
        // Rate limiting cooldown: maximum 3 requests within 10 minutes
        long recentCount = otpRepository.countByEmailAndPurposeAndCreatedAtAfter(
            email, purpose, LocalDateTime.now().minusMinutes(10));
        if (recentCount >= 3) {
            throw AppException.tooManyRequests("Too many OTP requests. Please wait a few minutes before trying again.");
        }

        // Resend cooldown: enforce at least 30 seconds between consecutive requests
        List<OtpRecord> activeOtps = otpRepository.findByEmailAndPurpose(email, purpose);
        for (OtpRecord active : activeOtps) {
            if (!active.isUsed() && active.getCreatedAt() != null &&
                active.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(30))) {
                throw AppException.tooManyRequests("Please wait at least 30 seconds before requesting a new OTP.");
            }
        }

        // Invalidate all prior unused OTPs for this email and purpose
        activeOtps.forEach(otp -> {
            if (!otp.isUsed()) {
                otp.setUsed(true);
                otpRepository.save(otp);
            }
        });

        // Generate cryptographically secure 6-digit OTP
        int number = random.nextInt(900000) + 100000;
        String plainOtp = String.valueOf(number);
        String hashedOtp = passwordEncoder.encode(plainOtp);

        OtpRecord record = OtpRecord.builder()
            .email(email)
            .otp(hashedOtp)
            .purpose(purpose)
            .expiresAt(LocalDateTime.now().plusMinutes(5))
            .referenceId(referenceId)
            .build();
        otpRepository.save(record);

        // Never log the plain OTP in production logs
        log.info("Secure 6-digit OTP generated for email {} and purpose {}", email, purpose);

        // Dispatch OTP via email service
        emailService.sendOtpEmail(email, plainOtp, purpose.name(), name);
    }

    public OtpRecord verifyOtp(String email, String rawOtp, OtpPurpose purpose) {
        OtpRecord record = otpRepository.findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(email, purpose)
            .orElseThrow(() -> AppException.badRequest("Invalid or expired OTP"));

        if (record.isUsed()) {
            throw AppException.badRequest("OTP has already been used. Please request a new one.");
        }

        if (record.getAttempts() >= 5) {
            record.setUsed(true);
            otpRepository.save(record);
            throw AppException.badRequest("Maximum OTP verification attempts reached. Please request a new OTP.");
        }

        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            record.setUsed(true);
            otpRepository.save(record);
            throw AppException.badRequest("OTP has expired. Please request a new OTP.");
        }

        // Check hashed OTP with BCrypt, or fallback to plain comparison for backward compatibility
        boolean matches = false;
        if (record.getOtp().startsWith("$2a$") || record.getOtp().startsWith("$2b$") || record.getOtp().startsWith("$2y$")) {
            matches = passwordEncoder.matches(rawOtp, record.getOtp());
        } else {
            matches = record.getOtp().equals(rawOtp);
        }

        if (!matches) {
            record.setAttempts(record.getAttempts() + 1);
            otpRepository.save(record);
            int remaining = 5 - record.getAttempts();
            throw AppException.badRequest(remaining > 0 
                ? "Invalid OTP. " + remaining + " attempt(s) remaining." 
                : "Invalid OTP. Maximum attempts reached.");
        }

        // Mark OTP as used so it cannot be reused
        record.setUsed(true);
        return otpRepository.save(record);
    }
}