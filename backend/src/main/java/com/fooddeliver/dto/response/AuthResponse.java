package com.fooddeliver.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    @Builder.Default
    private boolean otpRequired = false;
    private String message;
}