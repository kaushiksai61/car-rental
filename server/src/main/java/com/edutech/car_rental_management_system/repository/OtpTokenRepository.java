package com.edutech.car_rental_management_system.repository;

import com.edutech.car_rental_management_system.entity.OtpToken;
import com.edutech.car_rental_management_system.entity.OtpToken.Purpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    // ✅ Always LIST-based (never throws NonUniqueResultException)
    List<OtpToken> findByEmailAndPurposeAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String email,
            Purpose purpose,
            LocalDateTime now
    );

    // ✅ Consume previous active OTPs (prevents duplicates)
    @Modifying
    @Transactional
    @Query("UPDATE OtpToken o SET o.consumed = true " +
           "WHERE o.email = :email AND o.purpose = :purpose AND o.consumed = false")
    int consumeAllActive(@Param("email") String email, @Param("purpose") Purpose purpose);

    // ✅ Cleanup expired OTPs
    @Modifying
    @Transactional
    @Query("DELETE FROM OtpToken o WHERE o.expiresAt < :now")
    int deleteExpired(@Param("now") LocalDateTime now);
}
