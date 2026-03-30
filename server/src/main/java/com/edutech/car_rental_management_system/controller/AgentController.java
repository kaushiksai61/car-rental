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


// @RestController
// @RequestMapping("/api/agent")
// public class AgentController {

//     @Autowired
//     private CarService carService;

//     @Autowired
//     private BookingService bookingService;

//     @Autowired
//     private PaymentService paymentService;

//     // ✅ Add Car
//     @PostMapping("/car")
//     public ResponseEntity<Car> addCar(@RequestBody Car car) {
//         return new ResponseEntity<>(carService.addCar(car), HttpStatus.CREATED);
//     }

//     // ✅ Update Car
//     @PutMapping("/car/{carId}")
//     public ResponseEntity<Car> updateCar(
//             @PathVariable Long carId,
//             @RequestBody Car car) {
//         return ResponseEntity.ok(carService.updateCar(carId, car));
//     }

//     // ✅ Get Bookings
//     @GetMapping("/bookings")
//     public ResponseEntity<List<Booking>> getAllBookings() {
//         return ResponseEntity.ok(bookingService.getAllBookings());
//     }

//     // ✅ Update Booking Status
//     @PutMapping("/bookings/{id}/status")
//     public ResponseEntity<Booking> updateStatus(
//             @PathVariable Long id,
//             @RequestParam String status) {
//         return ResponseEntity.ok(
//                 bookingService.updateBookingStatus(id, status)
//         );
//     }

//     // ✅ Create Payment
//     @PostMapping("/payment/{bookingId}")
//     public ResponseEntity<Payment> createPayment(
//             @PathVariable Long bookingId,
//             @RequestBody Payment payment) {

//         return new ResponseEntity<>(
//                 paymentService.createPayment(bookingId, payment),
//                 HttpStatus.CREATED
//         );
//     }
// }

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    private final CarService carService;
    private final BookingService bookingService;
    private final PaymentService paymentService;

    public AgentController(CarService carService,
                           BookingService bookingService,
                           PaymentService paymentService) {
        this.carService = carService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    @PostMapping("/car")
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        return new ResponseEntity<>(carService.addCar(car), HttpStatus.CREATED);
    }

    @PutMapping("/car/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car car) {
        return ResponseEntity.ok(carService.updateCar(id, car));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> bookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PostMapping("/payment/{bookingId}")
    public ResponseEntity<Payment> createPayment(
            @PathVariable Long bookingId, @RequestBody Payment p) {
        return new ResponseEntity<>(
                paymentService.createPayment(bookingId, p),
                HttpStatus.CREATED
        );
    }
}