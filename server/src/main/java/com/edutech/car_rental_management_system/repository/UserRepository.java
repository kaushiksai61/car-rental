package com.edutech.car_rental_management_system.repository;

import com.edutech.car_rental_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username); // get user by username
}