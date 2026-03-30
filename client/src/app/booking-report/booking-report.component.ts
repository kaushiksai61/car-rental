import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit {

  bookingList: any[] = [];
  showError = false;
  errorMessage: any;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getBookingReport();
  }

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