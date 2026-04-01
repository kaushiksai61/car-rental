package com.edutech.car_rental_management_system.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

    private String token; // jwt token
    private String role;  // user role
    private Long userId;  // user id

    // default constructor
    public LoginResponse() {}

    // parameterized constructor
    @JsonCreator
    public LoginResponse(
            @JsonProperty("token") String token,
            @JsonProperty("role") String role,
            @JsonProperty("userId") Long userId) {

        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}