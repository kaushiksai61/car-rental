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

  itemForm!: FormGroup;
  carList: any = [];
  showError = false;
  errorMessage: any;
  idPaymentNow = false;
  selectedBooking: any = {};
  showMessage = false;
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {
    this.itemForm = this.fb.group({
      amount: ['', Validators.required],
      paymentDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentStatus: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings() {
    this.http.getBookingByAgent().subscribe(
      (res) => this.carList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch bookings.";
      }
    );
  }

  bookNow(val: any) {
    this.http.updateBookingStatus(val.id).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = "Booking status updated.";
        this.getBookings();
      },
      () => {
        this.showError = true;
        this.errorMessage = "Unable to update booking status.";
      }
    );
  }

  payment(val: any) {
    this.idPaymentNow = true;
    this.selectedBooking = val;
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const paymentDate = this.datePipe.transform(
      this.itemForm.value.paymentDate,
      'yyyy-MM-ddTHH:mm:ss'
    );

    const payload = {
      amount: this.itemForm.value.amount,
      paymentDate: paymentDate,
      paymentMethod: this.itemForm.value.paymentMethod,
      paymentStatus: this.itemForm.value.paymentStatus
    };

    this.http.bookingPayment(payload, this.selectedBooking.id).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = "Payment successful.";
        this.idPaymentNow = false;
        this.itemForm.reset();
        this.getBookings();
      },
      () => {
        this.showError = true;
        this.errorMessage = "Payment failed.";
      }
    );
  }
}