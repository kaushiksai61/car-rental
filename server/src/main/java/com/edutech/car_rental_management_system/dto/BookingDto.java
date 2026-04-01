package com.edutech.car_rental_management_system.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class BookingDto {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private Date rentalStartDate; // start date

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private Date rentalEndDate; // end date

    // default constructor
    public BookingDto() {}

    // parameterized constructor
    public BookingDto(Date rentalStartDate, Date rentalEndDate) {
        this.rentalStartDate = rentalStartDate;
        this.rentalEndDate = rentalEndDate;
    }

    public Date getRentalStartDate() {
        return rentalStartDate;
    }

    public void setRentalStartDate(Date rentalStartDate) {
        this.rentalStartDate = rentalStartDate;
    }

    public Date getRentalEndDate() {
        return rentalEndDate;
    }

    public void setRentalEndDate(Date rentalEndDate) {
        this.rentalEndDate = rentalEndDate;
    }
}