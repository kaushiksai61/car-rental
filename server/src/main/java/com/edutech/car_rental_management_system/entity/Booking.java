package com.edutech.car_rental_management_system.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "bookings") 
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //booking id

    @Temporal(TemporalType.TIMESTAMP)
    private Date rentalStartDate; // rental start date

    @Temporal(TemporalType.TIMESTAMP)
    private Date rentalEndDate; // rental end date

    private String status; // booking status
    private Double totalAmount; // total amount
    private String paymentStatus; // payment status

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment; // payment for booking

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // user who booked
    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car; // booked car
    // default constructor
    public Booking() {}
    //parameterized constructor
    public Booking(Long id, Date rentalStartDate, Date rentalEndDate,
                   String status, Double totalAmount, String paymentStatus) {
        this.id = id;
        this.rentalStartDate = rentalStartDate;
        this.rentalEndDate = rentalEndDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
    }
    //getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Date getRentalStartDate() { return rentalStartDate; }
    public void setRentalStartDate(Date rentalStartDate) { this.rentalStartDate = rentalStartDate; }

    public Date getRentalEndDate() { return rentalEndDate; }
    public void setRentalEndDate(Date rentalEndDate) { this.rentalEndDate = rentalEndDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }
}