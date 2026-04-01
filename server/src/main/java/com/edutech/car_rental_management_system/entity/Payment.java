package com.edutech.car_rental_management_system.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payments") // do not change this line
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // payment id

    private Double amount; // payment amount

    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentDate; // payment date

    private String paymentMethod; // payment method
    private String paymentStatus; // payment status

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking; // booking linked to this payment

    // default constructor
    public Payment() {}

    // parameterized constructor
    public Payment(Long id, Double amount, Date paymentDate,
                   String paymentMethod, String paymentStatus) {
        this.id = id;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

    // GETTERS & SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Date getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Date paymentDate) { this.paymentDate = paymentDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
}