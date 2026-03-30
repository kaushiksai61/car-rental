package com.edutech.car_rental_management_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.car_rental_management_system.entity.Booking;
import com.edutech.car_rental_management_system.entity.Car;
import com.edutech.car_rental_management_system.entity.Payment;
import com.edutech.car_rental_management_system.service.BookingService;
import com.edutech.car_rental_management_system.service.CarService;
import com.edutech.car_rental_management_system.service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    @Autowired
    private CarService carService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;


    // ADD CAR
    @PostMapping("/car")
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        try {
            Car saved = carService.addCar(car);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // GET ALL CARS
    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        try {
            List<Car> list = carService.getAllCars();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // UPDATE CAR DETAILS
    @PutMapping("/car/{carId}")
    public ResponseEntity<Car> updateCar(@PathVariable Long carId,
                                         @RequestBody Car updatedCar) {
        try {
            Car updated = carService.updateCar(carId, updatedCar);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // GET ALL BOOKINGS
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        try {
            List<Booking> list = bookingService.getAllBookings();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // UPDATE BOOKING STATUS
    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {
        try {
            Booking updated = bookingService.updateBookingStatus(bookingId, status);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // CREATE PAYMENT FOR BOOKING
    @PostMapping("/payment/{bookingId}")
    public ResponseEntity<Payment> createPayment(
            @PathVariable Long bookingId,
            @RequestBody Payment paymentRequest) {
        try {
            Payment saved = paymentService.generateInvoice(bookingId, paymentRequest);
            return new ResponseEntity<>(saved, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}