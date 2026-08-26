package com.fooddeliver.dto.request;
import com.fooddeliver.entity.enums.OtpPurpose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class ResendOtpRequest {
    @NotBlank @Email private String email;
    @NotNull private OtpPurpose purpose;
}