


package com.edutech.car_rental_management_system.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_tokens")
public class OtpToken {

    public enum Purpose {
        REGISTER_VERIFY,
        FORGOT_PASSWORD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 190)
    private String email;

    @Column(nullable = false, length = 200)
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Purpose purpose;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private int attempts = 0;

    @Column(nullable = false)
    private boolean consumed = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // 🔥 ADD THESE (IMPORTANT)
    private String username;

    private String password;

    private String role;

    public OtpToken() {
    }

    public OtpToken(String email, String otpHash, Purpose purpose, LocalDateTime expiresAt) {
        this.email = email;
        this.otpHash = otpHash;
        this.purpose = purpose;
        this.expiresAt = expiresAt;
        this.attempts = 0;
        this.consumed = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }

    public Purpose getPurpose() { return purpose; }
    public void setPurpose(Purpose purpose) { this.purpose = purpose; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }

    public boolean isConsumed() { return consumed; }
    public void setConsumed(boolean consumed) { this.consumed = consumed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // 🔥 NEW GETTERS/SETTERS
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}