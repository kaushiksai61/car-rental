import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  bookingList: any[] = [];     // list of payment report data
  showError = false;           // error flag
  errorMessage: any;           // error message
  showMessage = false;         // success flag

  constructor(private http: HttpService) {} // http service

  ngOnInit(): void {
    this.getPaymentReport();   // fetch payment report
  }

  // get payment report
  getPaymentReport() {
    this.http.paymentReport().subscribe(
      (res) => {
        this.bookingList = res;
      },
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch payment report.";
      }
    );
  }
}