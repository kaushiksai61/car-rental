

package com.edutech.car_rental_management_system.service;

import com.edutech.car_rental_management_system.entity.OtpToken;
import com.edutech.car_rental_management_system.entity.OtpToken.Purpose;
import com.edutech.car_rental_management_system.repository.OtpTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OtpService {

    private final OtpTokenRepository otpRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.otp.expiry.minutes:10}")
    private int expiryMinutes;

    @Value("${app.otp.max.attempts:5}")
    private int maxAttempts;

    public OtpService(OtpTokenRepository otpRepo, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.otpRepo = otpRepo;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // SEND OTP FOR REGISTRATION
    // =========================
    public void sendOtpForRegistration(com.edutech.car_rental_management_system.entity.User user) {

        String email = normalizeEmail(user.getEmail());

        otpRepo.deleteExpired(LocalDateTime.now());
        otpRepo.consumeAllActive(email, Purpose.REGISTER_VERIFY);

        String otp = generate6DigitOtp();
        String hash = passwordEncoder.encode(otp);

        OtpToken token = new OtpToken(
                email,
                hash,
                Purpose.REGISTER_VERIFY,
                LocalDateTime.now().plusMinutes(expiryMinutes)
        );

        // 🔥 store user data
        token.setUsername(user.getUsername());
        token.setPassword(passwordEncoder.encode(user.getPassword()));
        token.setRole(user.getRole());

        otpRepo.save(token);

        emailService.sendOtpEmail(email, "Verify your email - OTP", otp, "Email Verification");
    }

    // =========================
    // VERIFY OTP + RETURN TOKEN
    // =========================
    public OtpToken verifyOtpAndReturnToken(String email, Purpose purpose, String otpInput) {

        String normalizedEmail = normalizeEmail(email);
        String otp = otpInput == null ? "" : otpInput.trim();

        LocalDateTime now = LocalDateTime.now();

        List<OtpToken> tokens =
                otpRepo.findByEmailAndPurposeAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        normalizedEmail, purpose, now
                );

        if (tokens.isEmpty()) {
            throw new RuntimeException("OTP not found or expired. Please request again.");
        }

        OtpToken latest = tokens.get(0);

        if (latest.getAttempts() >= maxAttempts) {
            otpRepo.consumeAllActive(normalizedEmail, purpose);
            throw new RuntimeException("Too many wrong attempts.");
        }

        boolean ok = passwordEncoder.matches(otp, latest.getOtpHash());

        if (!ok) {
            latest.setAttempts(latest.getAttempts() + 1);
            otpRepo.save(latest);
            throw new RuntimeException("Invalid OTP.");
        }

        // ✅ consume AFTER success
        latest.setConsumed(true);
        otpRepo.save(latest);

        return latest;
    }

    // =========================
    // NORMALIZE EMAIL
    // =========================
    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String generate6DigitOtp() {
        int n = RANDOM.nextInt(900000) + 100000;
        return String.valueOf(n);
    }

    public void sendOtp(String email, Purpose purpose) {

        String normalizedEmail = normalizeEmail(email);

        otpRepo.deleteExpired(LocalDateTime.now());
        otpRepo.consumeAllActive(normalizedEmail, purpose);

        String otp = generate6DigitOtp();
        String hash = passwordEncoder.encode(otp);

        OtpToken token = new OtpToken(
                normalizedEmail,
                hash,
                purpose,
                LocalDateTime.now().plusMinutes(expiryMinutes)
        );

        otpRepo.save(token);

        String subject = (purpose == Purpose.REGISTER_VERIFY)
                ? "Verify your email - OTP"
                : "Reset your password - OTP";

        String purposeText = (purpose == Purpose.REGISTER_VERIFY)
                ? "Email Verification"
                : "Password Reset";

        emailService.sendOtpEmail(normalizedEmail, subject, otp, purposeText);
    }
}
