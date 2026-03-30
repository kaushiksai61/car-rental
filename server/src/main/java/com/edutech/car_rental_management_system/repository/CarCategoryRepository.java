package com.edutech.car_rental_management_system.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.car_rental_management_system.entity.CarCategory;

// public interface CarCategoryRepository {
//     // implement jpa repository here
// }

// package com.carrental.repository;

// import com.carrental.entity.CarCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarCategoryRepository extends JpaRepository<CarCategory, Long> {
}
