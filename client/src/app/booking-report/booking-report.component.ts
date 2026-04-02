import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit {

  bookingList: any[] = [];     // booking report list
  showError = false;           // error flag
  errorMessage: any;           // error message

  constructor(private http: HttpService) {} // http service

  ngOnInit(): void {
    this.getBookingReport();   // fetch booking report
  }

  // get booking report
  getBookingReport() {
    this.http.getBookingReport().subscribe(
      (res) => this.bookingList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch booking report.";
      }
    );
  }
}
