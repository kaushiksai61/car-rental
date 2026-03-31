package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.car_rental_management_system.entity.Car;
import com.edutech.car_rental_management_system.repository.CarRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    // ADD CAR (Agent)
    public Car addCar(Car car) {
        return carRepository.save(car);
    }

    // UPDATE CAR (Agent)
    public Car updateCar(Long carId, Car updatedCar) {
        Optional<Car> optional = carRepository.findById(carId);

        if (optional.isPresent()) {
            Car existing = optional.get();
            existing.setMake(updatedCar.getMake());
            existing.setModel(updatedCar.getModel());
            existing.setManufactureYear(updatedCar.getManufactureYear());
            existing.setRegistrationNumber(updatedCar.getRegistrationNumber());
            existing.setStatus(updatedCar.getStatus());
            existing.setRentalRatePerDay(updatedCar.getRentalRatePerDay());
            return carRepository.save(existing);
        }

        return null;
    }

    // GET ALL AVAILABLE CARS (Customer)
    public List<Car> getAvailableCars() {
        return carRepository.findByStatus("available");
    }

    // GET ALL CARS (Agent)
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
}