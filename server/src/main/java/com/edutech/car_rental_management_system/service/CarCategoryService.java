package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.car_rental_management_system.entity.CarCategory;
import com.edutech.car_rental_management_system.repository.CarCategoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CarCategoryService {

    @Autowired
    private CarCategoryRepository categoryRepository;

    // create car category
    public CarCategory createCarCategory(CarCategory carCategory) {
        return categoryRepository.save(carCategory);
    }

    // get all car categories
    public List<CarCategory> getAllCarCategories() {
        return categoryRepository.findAll();
    }

    // update car category
    public CarCategory updateCarCategory(Long categoryId, CarCategory updatedCarCategory) {

        Optional<CarCategory> optional = categoryRepository.findById(categoryId);

        if (optional.isPresent()) {
            CarCategory existing = optional.get();
            existing.setName(updatedCarCategory.getName());
            existing.setDescription(updatedCarCategory.getDescription());
            existing.setBaseRate(updatedCarCategory.getBaseRate());
            return categoryRepository.save(existing);
        }

        return null;
    }
}