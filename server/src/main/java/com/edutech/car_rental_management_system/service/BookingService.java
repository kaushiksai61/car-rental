package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.car_rental_management_system.entity.Booking;
import com.edutech.car_rental_management_system.entity.Car;
import com.edutech.car_rental_management_system.entity.User;
import com.edutech.car_rental_management_system.repository.BookingRepository;
import com.edutech.car_rental_management_system.repository.CarRepository;
import com.edutech.car_rental_management_system.repository.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    // get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // update booking status
    public Booking updateBookingStatus(Long bookingId, String status) {
        Optional<Booking> optional = bookingRepository.findById(bookingId);

        if (optional.isPresent()) {
            Booking booking = optional.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        return null;
    }

    // customer book car
    public Booking bookCar(Long userId, Long carId, Date rentalStartDate, Date rentalEndDate) {

        // check dates
        if (rentalStartDate.after(rentalEndDate)) {
            throw new IllegalArgumentException("Rental start date cannot be after rental end date");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Car> carOpt = carRepository.findById(carId);

        if (userOpt.isPresent() && carOpt.isPresent()) {

            Car car = carOpt.get();
            User user = userOpt.get();

            Booking booking = new Booking();

            booking.setRentalStartDate(rentalStartDate);
            booking.setRentalEndDate(rentalEndDate);
            booking.setStatus("pending");
            booking.setPaymentStatus("unpaid");

            // calculate total price
            long time = rentalEndDate.getTime() - rentalStartDate.getTime();
            long days = (time / (1000 * 60 * 60 * 24));
            if (days <= 0) days = 1;

            double total = days * car.getRentalRatePerDay();
            booking.setTotalAmount(total);

            booking.setUser(user);
            booking.setCar(car);

            // set car unavailable
            car.setStatus("booked");
            carRepository.save(car);

            // save booking
            Booking savedBooking = bookingRepository.save(booking);

            savedBooking.setUser(user);
            savedBooking.setCar(car);

            return savedBooking;
        }

        return null;
    }
}