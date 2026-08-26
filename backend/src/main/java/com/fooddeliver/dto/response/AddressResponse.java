package com.fooddeliver.dto.response;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AddressResponse {
    private Long id;
    private String label;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private boolean isDefault;
}