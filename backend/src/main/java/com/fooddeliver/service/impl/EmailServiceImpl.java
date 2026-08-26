package com.fooddeliver.service.impl;

import com.fooddeliver.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:trranjith00000@gmail.com}")
    private String fromEmail;

    @Value("${app.mail.sender-name:Online Food Ordering Platform}")
    private String senderName;

    @Override
    @Async
    public void sendOtpEmail(String to, String otp, String purpose, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            String fromHeader = String.format("%s <%s>", senderName, fromEmail);
            helper.setFrom(fromHeader);
            helper.setTo(to);

            String subject = switch (purpose) {
                case "REGISTER" -> "Verify your email - Online Food Ordering Platform";
                case "LOGIN" -> "Your Login OTP - Online Food Ordering Platform";
                case "ORDER" -> "Confirm your order - Online Food Ordering Platform";
                case "FORGOT_PASSWORD" -> "Reset your password - Online Food Ordering Platform";
                default -> "Your OTP - Online Food Ordering Platform";
            };
            helper.setSubject(subject);

            String greetingName = (name != null && !name.isBlank()) ? name : "User";
            String purposeDescription = switch (purpose) {
                case "REGISTER" -> "complete your account registration and email verification";
                case "LOGIN" -> "securely log in to your account";
                case "ORDER" -> "confirm and place your food order";
                case "FORGOT_PASSWORD" -> "reset your account password";
                default -> "authenticate your request";
            };

            StringBuilder otpBoxes = new StringBuilder();
            for (char c : otp.toCharArray()) {
                otpBoxes.append(String.format(
                    "<span style=\"display: inline-block; width: 44px; height: 54px; line-height: 54px; " +
                    "text-align: center; border: 2px solid #FF4500; font-size: 28px; font-weight: bold; " +
                    "color: #FF4500; margin: 0 4px; background: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 6px rgba(255,69,0,0.15);\">%c</span>",
                    c
                ));
            }

            String html = String.format("""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>%s</title>
                </head>
                <body style="margin: 0; padding: 20px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;">
                        <div style="background: linear-gradient(135deg, #FF4500 0%%, #FF6B35 100%%); padding: 32px 24px; text-align: center;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                                &#127828; Online Food Ordering Platform
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0 0; font-size: 14px;">Secure Email OTP Verification</p>
                        </div>
                        
                        <div style="padding: 36px 28px; color: #1E293B;">
                            <p style="font-size: 17px; font-weight: 600; margin: 0 0 12px 0;">Hello %s,</p>
                            <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                                Your One-Time Password (OTP) for email verification to %s is:
                            </p>
                            
                            <div style="text-align: center; margin: 28px 0;">
                                %s
                            </div>
                            
                            <div style="background-color: #FFF7ED; border-radius: 10px; border-left: 4px solid #FF4500; padding: 14px 16px; margin: 28px 0 16px 0;">
                                <p style="margin: 0; color: #C2410C; font-size: 14px; font-weight: 600;">
                                    &#9200; This OTP will expire in 5 minutes.
                                </p>
                                <p style="margin: 6px 0 0 0; color: #9A3412; font-size: 13px;">
                                    &#128274; For your security, do not share this code with anyone. Our team will never ask for your OTP.
                                </p>
                            </div>
                            
                            <p style="font-size: 13px; color: #64748B; margin: 20px 0 0 0;">
                                If you did not request this OTP, please ignore this email or contact support if you suspect unauthorized activity.
                            </p>
                        </div>
                        
                        <div style="background-color: #F1F5F9; padding: 20px; text-align: center; border-top: 1px solid #E2E8F0;">
                            <p style="margin: 0; font-size: 12px; color: #64748B;">
                                Regards,<br>
                                <strong>Online Food Ordering Platform Team</strong>
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 11px; color: #94A3B8;">
                                &copy; 2026 Online Food Ordering Platform. All rights reserved.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                subject,
                greetingName,
                purposeDescription,
                otpBoxes.toString()
            );

            helper.setText(html, true);
            mailSender.send(message);
            log.info("Secure OTP email successfully dispatched to {} for purpose {}", to, purpose);
        } catch (MessagingException e) {
            log.error("MessagingException when sending OTP email to {}", to, e);
        } catch (Exception e) {
            log.error("Unexpected error occurred while sending OTP email to {}", to, e);
        }
    }
}
