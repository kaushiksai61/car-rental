package com.edutech.car_rental_management_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String make;
    private String model;
    private String manufactureYear;
    private String registrationNumber;
    private String status;
    private Double rentalRatePerDay;
    private Double rating;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CarCategory category;

    @JsonIgnore
    @OneToMany(mappedBy = "car", cascade = CascadeType.REMOVE)
    private List<Booking> bookings;

    public Car() {}

    public Car(Long id, String make, String model, String manufactureYear,
               String registrationNumber, String status, Double rentalRatePerDay, Double rating) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.manufactureYear = manufactureYear;
        this.registrationNumber = registrationNumber;
        this.status = status;
        this.rentalRatePerDay = rentalRatePerDay;
        this.rating = rating;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getManufactureYear() { return manufactureYear; }
    public void setManufactureYear(String manufactureYear) { this.manufactureYear = manufactureYear; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getRentalRatePerDay() { return rentalRatePerDay; }
    public void setRentalRatePerDay(Double rentalRatePerDay) { this.rentalRatePerDay = rentalRatePerDay; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public CarCategory getCategory() { return category; }
    public void setCategory(CarCategory category) { this.category = category; }
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}