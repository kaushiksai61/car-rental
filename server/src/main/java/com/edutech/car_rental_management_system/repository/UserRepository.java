package com.edutech.car_rental_management_system.repository;

import com.edutech.car_rental_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    // ✅ IMPORTANT: case-insensitive email lookup (fixes verify 400)
    Optional<User> findByEmailIgnoreCase(String email);
}