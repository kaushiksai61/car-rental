import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  bookingList: any[] = [];
  isLoading:   boolean = false;
  showError:   boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpService,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getMyBookings();
  }

  getMyBookings(): void {
    this.isLoading = true;
    this.showError = false;

    const userId = this.auth.getUserId();

    if (!userId) {
      this.showError    = true;
      this.errorMessage = 'User session not found. Please log in again.';
      this.isLoading    = false;
      return;
    }

    this.http.getMyBookings(userId).subscribe(
      (res: any) => {
        this.bookingList = res || [];
        this.isLoading   = false;
      },
      (err: any) => {
        this.showError    = true;
        this.errorMessage = 'Failed to load your bookings. Please try again.';
        this.isLoading    = false;
      }
    );
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || '—';
  }

  getDays(start: any, end: any): number {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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

  getPaymentClass(status: string): string {
    if (!status) return 'pay-unpaid';
    return status.toLowerCase() === 'paid' ? 'pay-paid' : 'pay-unpaid';
  }
}