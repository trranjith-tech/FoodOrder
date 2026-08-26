package com.fooddeliver.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class AddressRequest {
    @NotBlank private String label;
    @NotBlank private String street;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String pincode;
    private boolean isDefault;
}