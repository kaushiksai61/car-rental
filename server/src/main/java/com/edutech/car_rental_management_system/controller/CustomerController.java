package com.edutech.car_rental_management_system.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.car_rental_management_system.dto.BookingDto;
import com.edutech.car_rental_management_system.entity.Booking;
import com.edutech.car_rental_management_system.entity.Car;
import com.edutech.car_rental_management_system.service.BookingService;
import com.edutech.car_rental_management_system.service.CarService;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


// public class CustomerController {
   
//         // get all available cars.
//         // note: return all the cars where car status is "available"
   
//         // book a car
//     }

// package com.edutech.car_rental_management_system.controller;

// import com.edutech.car_rental_management_system.entity.Booking;
// import com.edutech.car_rental_management_system.entity.Car;
// import com.edutech.car_rental_management_system.service.BookingService;
// import com.edutech.car_rental_management_system.service.CarService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Date;
// import java.util.List;
// import java.util.Map;
// @RestController
// @RequestMapping("/api/customers")
// public class CustomerController {

//     @Autowired
//     private CarService carService;

//     @Autowired
//     private BookingService bookingService;

//     // ✅ Get Available Cars
//     @GetMapping("/cars/available")
//     public ResponseEntity<List<Car>> getAvailableCars() {
//         return ResponseEntity.ok(carService.getAvailableCars());
//     }

//     // ✅ Book Car
//     @PostMapping("/booking")
//     public ResponseEntity<Booking> bookCar(
//             @RequestParam Long userId,
//             @RequestParam Long carId,
//             @RequestBody BookingDto dto) {

//         return ResponseEntity.ok(
//                 bookingService.bookCar(
//                         userId,
//                         carId,
//                         dto.getRentalStartDate(),
//                         dto.getRentalEndDate()
//                 )
//         );
//     }
// }

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CarService carService;
    private final BookingService bookingService;

    public CustomerController(CarService carService,
                              BookingService bookingService) {
        this.carService = carService;
        this.bookingService = bookingService;
    }

    @GetMapping("/cars/available")
    public ResponseEntity<List<Car>> availableCars() {
        return ResponseEntity.ok(carService.getAvailableCars());
    }

    @PostMapping("/booking")
    public ResponseEntity<Booking> book(
            @RequestParam Long userId,
            @RequestParam Long carId,
            @RequestBody BookingDto dto) {
        return ResponseEntity.ok(
                bookingService.bookCar(
                        userId, carId,
                        dto.getRentalStartDate(),
                        dto.getRentalEndDate()));
    }
}