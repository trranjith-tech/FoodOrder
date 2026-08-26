package com.fooddeliver.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class ResetPasswordRequest {
    @NotBlank private String email;
    @NotBlank private String otp;
    @NotBlank @Size(min = 8) private String newPassword;
}