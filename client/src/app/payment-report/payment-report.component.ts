import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

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
    this.getPaymentReport();
  }

  getPaymentReport(): void {
    this.isLoading = true;
    this.showError = false;
    this.http.paymentReport().subscribe(
      (res: any) => {
        this.bookingList = res;
        this.isLoading = false;
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Failed to load payment report. Please try again.';
        this.isLoading = false;
      }
    );
  }

  get filteredPayments(): any[] {
    if (!this.searchTerm) return this.bookingList;
    const term = this.searchTerm.toLowerCase();
    return this.bookingList.filter((p: any) =>
      (p.paymentMethod?.toLowerCase().includes(term)) ||
      (p.paymentStatus?.toLowerCase().includes(term)) ||
      (p.booking?.car?.make?.toLowerCase().includes(term)) ||
      (p.booking?.car?.model?.toLowerCase().includes(term)) ||
      (p.booking?.user?.username?.toLowerCase().includes(term))
    );
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || '-';
  }

  getTotalRevenue(): number {
    return this.bookingList.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  }

  getPaymentStatusClass(status: string): string {
    if (!status) return 'status-pending';
    switch (status.toLowerCase()) {
      case 'success':
      case 'paid':
      case 'completed': return 'status-success';
      case 'pending':   return 'status-pending';
      case 'failed':    return 'status-failed';
      default:          return 'status-pending';
    }
  }

  getMethodIcon(method: string): string {
    if (!method) return '💳';
    switch (method.toLowerCase()) {
      case 'credit card':
      case 'card':       return '💳';
      case 'cash':       return '💵';
      case 'upi':        return '📱';
      case 'netbanking': return '🏦';
      default:           return '💳';
    }
  }
}