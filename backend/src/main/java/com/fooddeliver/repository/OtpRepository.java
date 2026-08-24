package com.fooddeliver.repository;
import com.fooddeliver.entity.OtpRecord;
import com.fooddeliver.entity.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
public interface OtpRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(String email, OtpPurpose purpose);
    long countByEmailAndPurposeAndCreatedAtAfter(String email, OtpPurpose purpose, LocalDateTime after);
    List<OtpRecord> findByEmailAndPurpose(String email, OtpPurpose purpose);
}