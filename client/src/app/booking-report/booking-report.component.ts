import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit {

  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  carList: any = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  toBook: any = {};
  bookingList: any = [];
  isLoading: boolean = false;
  searchTerm: string = '';

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getBookingReport();
  }

  getBookingReport(): void {
    this.isLoading = true;
    this.showError = false;
    this.http.getBookingReport().subscribe(
      (res: any) => {
        this.bookingList = res;
        this.isLoading = false;
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Failed to load booking report. Please try again.';
        this.isLoading = false;
      }
    );
  }

  get filteredBookings(): any[] {
    if (!this.searchTerm) return this.bookingList;
    const term = this.searchTerm.toLowerCase();
    return this.bookingList.filter((b: any) =>
      (b.car?.make?.toLowerCase().includes(term)) ||
      (b.car?.model?.toLowerCase().includes(term)) ||
      (b.user?.username?.toLowerCase().includes(term)) ||
      (b.status?.toLowerCase().includes(term))
    );
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
      case 'cancelled': return 'status-cancelled';
      default:          return 'status-pending';
    }
  }
}