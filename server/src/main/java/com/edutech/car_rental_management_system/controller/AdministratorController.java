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


// public class AdministratorController {


   
//         // create car category
    

   
//         // get all car categories
    

//            // get all bookings
    
   
//        // get all payments
//     }

// package com.edutech.car_rental_management_system.controller;

// import com.edutech.car_rental_management_system.entity.Booking;
// import com.edutech.car_rental_management_system.entity.CarCategory;
// import com.edutech.car_rental_management_system.entity.Payment;
// import com.edutech.car_rental_management_system.service.BookingService;
// import com.edutech.car_rental_management_system.service.CarCategoryService;
// import com.edutech.car_rental_management_system.service.PaymentService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

@RestController
@RequestMapping("/api/administrator")
public class AdministratorController {

    @Autowired
    private CarCategoryService carCategoryService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    // ✅ Create Category
    @PostMapping("/car-categories")
    public ResponseEntity<CarCategory> createCategory(
            @RequestBody CarCategory category) {
        return new ResponseEntity<>(
                carCategoryService.createCategory(category),
                HttpStatus.CREATED
        );
    }

    // ✅ Get Categories
    @GetMapping("/car-categories")
    public ResponseEntity<List<CarCategory>> getAllCategories() {
        return ResponseEntity.ok(carCategoryService.getAllCategories());
    }

    // ✅ Update Category
    @PutMapping("/car-categories/{id}")
    public ResponseEntity<CarCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody CarCategory category) {
        return ResponseEntity.ok(
                carCategoryService.updateCategory(id, category)
        );
    }

    // ✅ Booking Report
    @GetMapping("/reports/bookings")
    public ResponseEntity<List<Booking>> bookingReport() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ Payment Report
    @GetMapping("/reports/payments")
    public ResponseEntity<List<Payment>> paymentReport() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}