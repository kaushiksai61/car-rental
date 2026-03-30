package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.car_rental_management_system.entity.Booking;
import com.edutech.car_rental_management_system.entity.Payment;
import com.edutech.car_rental_management_system.repository.BookingRepository;
import com.edutech.car_rental_management_system.repository.PaymentRepository;
import com.edutech.car_rental_management_system.repository.UserRepository;

import java.util.List;


// public class PaymentService {
//     // implement payment service
// }


// package com.carrental.service;

// import com.carrental.entity.Booking;
// import com.carrental.entity.Payment;
// import com.carrental.repository.BookingRepository;
// import com.carrental.repository.PaymentRepository;
// import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Payment createPayment(Long bookingId, Payment payment) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow();

        payment.setBooking(booking);
        booking.setPaymentStatus("paid");

        bookingRepository.save(booking);
        return paymentRepository.save(payment);
    }

    // public List<Payment> getAllPayments() {
    //     return paymentRepository.findAll();
    // }
    public List<Payment> getAllPayments() {
    return paymentRepository.findAll();
}
}