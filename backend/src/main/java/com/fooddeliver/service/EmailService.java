package com.fooddeliver.service;

public interface EmailService {
    void sendOtpEmail(String to, String otp, String purpose, String name);
}