package com.edutech.car_rental_management_system.repository;

import com.edutech.car_rental_management_system.entity.CarCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import javax.transaction.Transactional;
@Repository
public interface CarCategoryRepository extends JpaRepository<CarCategory, Long> {

}