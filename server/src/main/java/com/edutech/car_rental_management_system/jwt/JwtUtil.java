package com.edutech.car_rental_management_system.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.edutech.car_rental_management_system.entity.User;
import com.edutech.car_rental_management_system.repository.UserRepository;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // secret key for HS512
    private static final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    private final int expiration = 86400; // 24 hours

    @Autowired
    private UserRepository userRepository;

    // generate jwt token
    public String generateToken(String username) {

        User user = userRepository.findByUsername(username);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole()); // store role
        claims.put("id", user.getId());     // store user id

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration * 1000);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username) // username
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(secretKey) // sign token
                .compact();
    }

    // extract all claims
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    // check expiration
    private boolean isExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // validate token
    public boolean validateToken(String token, String username) {
        return extractAllClaims(token).getSubject().equals(username)
                && !isExpired(token);
    }
}
