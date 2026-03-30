package com.edutech.car_rental_management_system.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.car_rental_management_system.entity.Booking;


// public interface BookingRepository {
//     // implement jpa repository here
// }


// package com.carrental.repository;

// import com.carrental.entity.Booking;
// import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByCarId(Long carId);
}