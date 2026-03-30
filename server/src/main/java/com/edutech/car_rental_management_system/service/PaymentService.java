package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.car_rental_management_system.entity.Booking;
import com.edutech.car_rental_management_system.entity.Payment;
import com.edutech.car_rental_management_system.repository.BookingRepository;
import com.edutech.car_rental_management_system.repository.PaymentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ADMIN REPORT
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // AGENT CREATES PAYMENT
    public Payment generateInvoice(Long bookingId, Payment paymentRequest) {

        Optional<Booking> optional = bookingRepository.findById(bookingId);

        if (optional.isPresent()) {
            Booking booking = optional.get();

            paymentRequest.setBooking(booking);

            // mark booking as paid
            booking.setPaymentStatus("paid");
            bookingRepository.save(booking);

            return paymentRepository.save(paymentRequest);
        }

        return null;
    }
}