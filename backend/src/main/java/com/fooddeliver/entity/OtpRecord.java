package com.fooddeliver.entity;

import com.fooddeliver.entity.enums.OtpPurpose;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_records")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OtpRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String email;
    @Column(nullable = false) private String otp;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private OtpPurpose purpose;
    @Column(nullable = false) private LocalDateTime expiresAt;
    @Builder.Default private boolean used = false;
    @Builder.Default private int attempts = 0;
    private Long referenceId;
    @CreationTimestamp private LocalDateTime createdAt;
}