import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.scss']
})
export class GetBookingsComponent implements OnInit {

  itemForm!: FormGroup;            // reactive form for payment
  carList: any = [];               // booking list for agent

  showError = false;               // error flag
  errorMessage: any;               // error message

  idPaymentNow = false;            // payment form toggle
  selectedBooking: any = {};       // selected booking for payment

  showMessage = false;             // success flag
  responseMessage: any;            // success message

  constructor(
    private fb: FormBuilder,       // form builder
    private router: Router,        // router navigation
    private http: HttpService,     // http service
    private auth: AuthService,     // auth service
    private datePipe: DatePipe     // date formatter
  ) {
    // payment form initialization
    this.itemForm = this.fb.group({
      amount: ['', Validators.required],        // payment amount
      paymentDate: ['', Validators.required],   // payment date
      paymentMethod: ['', Validators.required], // payment method
      paymentStatus: ['', Validators.required]  // payment status
    });
  }

  ngOnInit(): void {
    this.getBookings();             // get all bookings
  }

  // get all bookings for agent
  getBookings() {
    this.http.getBookingByAgent().subscribe(
      (res) => this.carList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch bookings.";
      }
    );
  }

  // update booking status
  bookNow(val: any) {
    this.http.updateBookingStatus(val.id).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = "Booking status updated.";
        this.getBookings();        // refresh booking list
      },
      () => {
        this.showError = true;
        this.errorMessage = "Unable to update booking status.";
      }
    );
  }

  // initiate payment for booking
  payment(val: any) {
    this.idPaymentNow = true;
    this.selectedBooking = val;    // set booking for payment
  }

  // submit payment for booking
  onSubmit() {

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const paymentDate = this.datePipe.transform(
      this.itemForm.value.paymentDate,
      'yyyy-MM-ddTHH:mm:ss'
    );

    // payment payload
    const payload = {
      amount: this.itemForm.value.amount,
      paymentDate: paymentDate,
      paymentMethod: this.itemForm.value.paymentMethod,
      paymentStatus: this.itemForm.value.paymentStatus
    };

    // create payment for booking
    this.http.bookingPayment(payload, this.selectedBooking.id).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = "Payment successful.";
        this.idPaymentNow = false;
        this.itemForm.reset();
        this.getBookings();       // refresh booking list
      },
      () => {
        this.showError = true;
        this.errorMessage = "Payment failed.";
      }
    );
  }
}