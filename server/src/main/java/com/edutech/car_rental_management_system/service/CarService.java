package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.car_rental_management_system.entity.Car;
import com.edutech.car_rental_management_system.repository.CarRepository;

import java.util.List;
import java.util.Optional;


// public class CarService {
//     // implement car service
// }


// package com.carrental.service;

// import com.carrental.entity.Car;
// import com.carrental.repository.CarRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public Car addCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long carId, Car car) {
        Car existing = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        existing.setMake(car.getMake());
        existing.setModel(car.getModel());
        existing.setManufactureYear(car.getManufactureYear());
        existing.setRegistrationNumber(car.getRegistrationNumber());
        existing.setStatus(car.getStatus());
        existing.setRentalRatePerDay(car.getRentalRatePerDay());

        return carRepository.save(existing);
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByStatus("available");
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
}