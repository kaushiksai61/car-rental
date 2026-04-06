

package com.edutech.car_rental_management_system.controller;

import com.edutech.car_rental_management_system.dto.LoginRequest;
import com.edutech.car_rental_management_system.dto.LoginResponse;
import com.edutech.car_rental_management_system.dto.OtpRequest;
import com.edutech.car_rental_management_system.dto.OtpVerifyRequest;
import com.edutech.car_rental_management_system.dto.ResetPasswordRequest;
import com.edutech.car_rental_management_system.entity.OtpToken;
import com.edutech.car_rental_management_system.entity.OtpToken.Purpose;
import com.edutech.car_rental_management_system.entity.User;
import com.edutech.car_rental_management_system.jwt.JwtUtil;
import com.edutech.car_rental_management_system.repository.UserRepository;
import com.edutech.car_rental_management_system.service.OtpService;
import com.edutech.car_rental_management_system.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/user")
public class RegisterAndLoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;


    // =========================
    // REGISTER (NO USER SAVE)
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        Map<String, Object> body = new LinkedHashMap<>();

        try {
            String email = normalizeEmail(user.getEmail());

            if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
                throw new RuntimeException("Email already registered.");
            }

            otpService.sendOtpForRegistration(user);

            body.put("message", "OTP sent. Verify to complete registration.");
            body.put("email", email);

            return ResponseEntity.ok(body);

        } catch (Exception e) {
            body.put("message", "Registration failed.");
            body.put("error", e.getMessage());
            return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }
    }

    // =========================
    // VERIFY OTP → CREATE USER
    // =========================
    @PostMapping("/verify-email-otp")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody OtpVerifyRequest req) {

        Map<String, Object> body = new LinkedHashMap<>();

        try {
            String email = normalizeEmail(req.getEmail());
            String otp = req.getOtp().trim();

            // 🔥 THIS RETURNS TOKEN (no second query)
            OtpToken token = otpService.verifyOtpAndReturnToken(
                    email,
                    Purpose.REGISTER_VERIFY,
                    otp
            );

            User user = new User();
            user.setUsername(token.getUsername());
            user.setPassword(token.getPassword());
            user.setEmail(email);
            user.setRole(token.getRole());
            user.setEnabled(true);

            userRepository.save(user);

            body.put("message", "Account created successfully.");
            return ResponseEntity.ok(body);

        } catch (Exception e) {
            body.put("message", "OTP verification failed.");
            body.put("error", e.getMessage());
            return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

      @PostMapping({"/resend-otp", "/resend-email-otp", "/resendEmailOtp"})
    public ResponseEntity<?> resendEmailOtp(@RequestBody OtpRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();

        try {
            String email = normalizeEmail(req.getEmail());

            // Ensure user exists
            userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email"));

            otpService.sendOtp(email, Purpose.REGISTER_VERIFY);

            body.put("message", "OTP resent successfully.");
            body.put("email", email);
            return ResponseEntity.ok(body);

        } catch (Exception e) {
            body.put("message", "Resend OTP failed.");
            body.put("error", e.getMessage());
            return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }
    }

@PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            User user = userService.getUserByUsername(loginRequest.getUsername());
            String token = jwtUtil.generateToken(loginRequest.getUsername());

            LoginResponse response = new LoginResponse(token, user.getRole(), user.getId());
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (DisabledException e) {
            return new ResponseEntity<>(
                    new LoginResponse("Email not verified. Please verify OTP.", null, null),
                    HttpStatus.FORBIDDEN
            );
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(
                    new LoginResponse("Invalid username or password", null, null),
                    HttpStatus.UNAUTHORIZED
            );
        }
    }

    // =========================
    // FORGOT PASSWORD (SEND OTP)
    // =========================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody OtpRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();

        try {
            String email = normalizeEmail(req.getEmail());

            userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email"));

            otpService.sendOtp(email, Purpose.FORGOT_PASSWORD);

            body.put("message", "OTP sent to email for password reset.");
            body.put("email", email);
            return ResponseEntity.ok(body);

        } catch (Exception e) {
            body.put("message", "Forgot password failed.");
            body.put("error", e.getMessage());
            return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }
    }

    // =========================
    // RESET PASSWORD (VERIFY OTP + UPDATE PASSWORD)
    // =========================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();

        try {
            String email = normalizeEmail(req.getEmail());
            String otp = req.getOtp() == null ? "" : req.getOtp().trim();

            otpService.verifyOtpAndReturnToken(email, Purpose.FORGOT_PASSWORD, otp);

            User user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email"));

            user.setPassword(passwordEncoder.encode(req.getNewPassword()));
            userRepository.save(user);

            body.put("message", "Password updated successfully.");
            body.put("email", email);
            return ResponseEntity.ok(body);

        } catch (Exception e) {
            body.put("message", "Reset password failed.");
            body.put("error", e.getMessage());
            return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }
    }

}