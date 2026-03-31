package com.edutech.car_rental_management_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.car_rental_management_system.entity.Booking;
import com.edutech.car_rental_management_system.entity.CarCategory;
import com.edutech.car_rental_management_system.entity.Payment;
import com.edutech.car_rental_management_system.service.BookingService;
import com.edutech.car_rental_management_system.service.CarCategoryService;
import com.edutech.car_rental_management_system.service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/administrator")
public class AdministratorController {

    @Autowired
    private CarCategoryService carCategoryService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;


    
    @PostMapping("/car-categories")
    public ResponseEntity<CarCategory> createCarCategory(@RequestBody CarCategory carCategory) {
        try {
            CarCategory saved = carCategoryService.createCarCategory(carCategory);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    
    @GetMapping("/car-categories")
    public ResponseEntity<List<CarCategory>> getAllCarCategories() {
        try {
            List<CarCategory> list = carCategoryService.getAllCarCategories();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    
    @PutMapping("/car-categories/{categoryId}")
    public ResponseEntity<CarCategory> updateCarCategory(
            @PathVariable Long categoryId,
            @RequestBody CarCategory updatedCarCategory) {
        try {
            CarCategory updated = carCategoryService.updateCarCategory(categoryId, updatedCarCategory);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    
    @GetMapping("/reports/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        try {
            List<Booking> list = bookingService.getAllBookings();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    
    @GetMapping("/reports/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        try {
            List<Payment> list = paymentService.getAllPayments();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}