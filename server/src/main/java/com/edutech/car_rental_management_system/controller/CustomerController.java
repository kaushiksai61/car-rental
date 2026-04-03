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
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CarService carService;

    @Autowired
    private BookingService bookingService;

    // GET AVAILABLE CARS
    @GetMapping("/cars/available")
    public ResponseEntity<List<Car>> getAvailableCars() {
        try {
            List<Car> list = carService.getAvailableCars();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // BOOK A CAR
    @PostMapping("/booking")
    public ResponseEntity<Booking> bookCar(
            @RequestParam Long userId,
            @RequestParam Long carId,
            @RequestBody BookingDto bookingDto) {
        try {
            Booking saved = bookingService.bookCar(
                    userId,
                    carId,
                    bookingDto.getRentalStartDate(),
                    bookingDto.getRentalEndDate()
            );
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET BOOKINGS BY USER ID
    @GetMapping("/bookings/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        try {
            List<Booking> list = bookingService.getBookingsByUserId(userId);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}