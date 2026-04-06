package com.edutech.car_rental_management_system.service;

import com.edutech.car_rental_management_system.entity.User;
import com.edutech.car_rental_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ REGISTER USER (OTP-based)
    public User registerUser(User user) {

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ VERY IMPORTANT: disable user until OTP verified
        user.setEnabled(false);

        return userRepository.save(user);
    }

    // GET USER BY USERNAME
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with username: " + username)
                );
    }

    // ✅ Enable user after OTP verification
    public void enableUser(String username) {
        User user = getUserByUsername(username);
        user.setEnabled(true);
        userRepository.save(user);
    }

    // LOAD USER FOR AUTH
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRole())
                .disabled(!user.isEnabled()) // ✅ blocks login if OTP not verified
                .build();
    }
}