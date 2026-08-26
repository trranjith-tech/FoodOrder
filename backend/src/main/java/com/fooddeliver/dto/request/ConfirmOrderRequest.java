package com.fooddeliver.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class ConfirmOrderRequest {
    @NotBlank private String otp;
}