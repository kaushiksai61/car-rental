package com.edutech.car_rental_management_system.dto;


import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

// public class BookingDto {

  
// }

// package com.edutech.car_rental_management_system.dto;

// import com.fasterxml.jackson.annotation.JsonFormat;
// import java.util.Date;

public class BookingDto {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date rentalStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date rentalEndDate;

    public BookingDto() {
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

