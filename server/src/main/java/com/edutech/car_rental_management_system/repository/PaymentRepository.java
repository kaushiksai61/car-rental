package com.edutech.car_rental_management_system.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.car_rental_management_system.entity.Payment;

// public interface PaymentRepository {
//     // implement jpa repository here
// }

// package com.carrental.repository;

// import com.carrental.entity.Payment;
// import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}

