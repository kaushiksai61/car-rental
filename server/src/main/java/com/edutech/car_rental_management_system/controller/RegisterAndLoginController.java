package com.edutech.car_rental_management_system.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import com.edutech.car_rental_management_system.dto.LoginRequest;
import com.edutech.car_rental_management_system.dto.LoginResponse;
import com.edutech.car_rental_management_system.entity.User;
import com.edutech.car_rental_management_system.jwt.JwtUtil;
import com.edutech.car_rental_management_system.service.UserService;

@RestController
@RequestMapping("/api/user")
public class RegisterAndLoginController {
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        try {
            User saved = userService.registerUser(user);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
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
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            User user = userService.getUserByUsername(loginRequest.getUsername());

            LoginResponse response = new LoginResponse(
                    token,
                    user.getRole(),
                    user.getId()
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(
                    new LoginResponse("Invalid username or password", null, null),
                    HttpStatus.UNAUTHORIZED
            );
        }
    }
}