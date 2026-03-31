import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  bookingList: any[] = [];
  showError = false;
  errorMessage: any;
  showMessage = false;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getPaymentReport();
  }

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