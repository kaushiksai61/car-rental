import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.scss']
})
export class GetBookingsComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  carList: any = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  toBook: any = {};
  idPaymentNow: boolean = false;
  selectedBooking: any = {};
  isLoading: boolean = false;
  isTableLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {
    this.itemForm = this.fb.group({
      amount:        ['', Validators.required],
      paymentDate:   ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentStatus: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings(): void {
    this.isTableLoading = true;
    this.http.getBookingByAgent().subscribe(
      (res: any) => {
        this.carList = res;
        this.isTableLoading = false;
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.isTableLoading = false;
      }
    );
  }

  bookNow(val: any): void {
    this.showMessage = false;
    this.http.updateBookingStatus(val.id).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = 'Booking status updated successfully.';
        this.getBookings();
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Failed to update booking status.';
      }
    );
  }

  payment(val: any): void {
    this.idPaymentNow = true;
    this.selectedBooking = val;
    this.showMessage = false;
    this.showError = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.showMessage = false;
    this.showError = false;

    const formVal = this.itemForm.value;
    const formatted = {
      ...formVal,
      paymentDate: this.datePipe.transform(formVal.paymentDate, 'yyyy-MM-dd')
    };

    this.http.bookingPayment(formatted, this.selectedBooking.id).subscribe(
      () => {
        this.isLoading = false;
        this.showMessage = true;
        this.responseMessage = 'Payment processed successfully.';
        this.itemForm.reset();
        this.selectedBooking = {};
        this.idPaymentNow = false;
        this.getBookings();
      },
      () => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = 'Failed to process payment. Please try again.';
      }
    );
  }

  cancelPayment(): void {
    this.idPaymentNow = false;
    this.selectedBooking = {};
    this.itemForm.reset();
    this.showMessage = false;
    this.showError = false;
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || '-';
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-pending';
    switch (status.toLowerCase()) {
      case 'booked':    return 'status-booked';
      case 'pending':   return 'status-pending';
      case 'completed': return 'status-completed';
      default:          return 'status-pending';
    }
  }
}