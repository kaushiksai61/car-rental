package com.edutech.car_rental_management_system.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.car_rental_management_system.entity.User;

// public interface UserRepository {
//     // implement jpa repository here
// }


// package com.carrental.repository;

// import com.carrental.entity.User;
// import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}