package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.car_rental_management_system.entity.CarCategory;
import com.edutech.car_rental_management_system.repository.CarCategoryRepository;

import java.util.List;
import java.util.Optional;


// public class CarCategoryService {
//     // implement car category service
// }


// package com.carrental.service;

// import com.carrental.entity.CarCategory;
// import com.carrental.repository.CarCategoryRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

@Service
public class CarCategoryService {

    private final CarCategoryRepository categoryRepository;

    public CarCategoryService(CarCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CarCategory createCategory(CarCategory category) {
        return categoryRepository.save(category);
    }

    public List<CarCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public CarCategory updateCategory(Long categoryId, CarCategory category) {
        CarCategory existing = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setBaseRate(category.getBaseRate());

        return categoryRepository.save(existing);
    }
}
