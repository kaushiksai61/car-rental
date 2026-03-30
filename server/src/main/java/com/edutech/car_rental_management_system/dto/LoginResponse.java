package com.edutech.car_rental_management_system.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

// public class LoginResponse {

    
// }

// package com.edutech.car_rental_management_system.dto;

// import com.fasterxml.jackson.annotation.JsonCreator;
// import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

    private String token;
    private String role;

    @JsonCreator
    public LoginResponse(
            @JsonProperty("token") String token,
            @JsonProperty("role") String role) {
        this.token = token;
        this.role = role;
    }

    public LoginResponse() {
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
}