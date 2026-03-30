package com.edutech.car_rental_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.car_rental_management_system.entity.Car;

import java.util.List;

// public interface CarRepository {
//     // implement jpa repository here
// }

// package com.carrental.repository;

// import com.carrental.entity.Car;
// import org.springframework.data.jpa.repository.JpaRepository;
// import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByStatus(String status);
}
