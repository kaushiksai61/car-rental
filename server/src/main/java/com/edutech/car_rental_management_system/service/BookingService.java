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

// public class BookingService {
//     // implement booking service
// }


// package com.carrental.service;

// import com.carrental.entity.Booking;
// import com.carrental.entity.Car;
// import com.carrental.entity.User;
// import com.carrental.repository.BookingRepository;
// import com.carrental.repository.CarRepository;
// import com.carrental.repository.UserRepository;
// import org.springframework.stereotype.Service;

// import java.util.Date;
// import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          CarRepository carRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.carRepository = carRepository;
    }

    public Booking bookCar(Long userId, Long carId, Date startDate, Date endDate) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCar(car);
        booking.setRentalStartDate(startDate);
        booking.setRentalEndDate(endDate);
        booking.setStatus("booked");
        booking.setPaymentStatus("pending");

        car.setStatus("booked");
        carRepository.save(car);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}