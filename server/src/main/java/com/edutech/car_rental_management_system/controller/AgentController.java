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

    // add car
    @PostMapping("/car")
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        Car saved = carService.addCar(car);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // get all cars
    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> list = carService.getAllCars();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // update car details
    @PutMapping("/car/{carId}")
    public ResponseEntity<Car> updateCar(@PathVariable Long carId,
                                         @RequestBody Car updatedCar) {
        Car updated = carService.updateCar(carId, updatedCar);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // get all bookings
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> list = bookingService.getAllBookings();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // update booking status
    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {

        Booking updated = bookingService.updateBookingStatus(bookingId, status);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // create payment for booking
    @PostMapping("/payment/{bookingId}")
    public ResponseEntity<Payment> createPayment(
            @PathVariable Long bookingId,
            @RequestBody Payment paymentRequest) {

        Payment saved = paymentService.generateInvoice(bookingId, paymentRequest);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }
}