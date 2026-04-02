import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {

  itemForm!: FormGroup;          // reactive form for booking
  carList: any = [];             // available car list
  toBook: any = {};              // selected car for booking

  showError = false;             // error flag
  errorMessage: any;             // error message

  showMessage = false;           // success flag
  responseMessage: any;          // success message

  constructor(
    private fb: FormBuilder,     // form builder
    private router: Router,      // router navigation
    private http: HttpService,   // http service
    private auth: AuthService,   // auth service
    private datePipe: DatePipe   // date formatter
  ) {
    // booking form initialization
    this.itemForm = this.fb.group({
      rentalStartDate: ['', Validators.required], // rental start date
      rentalEndDate: ['', Validators.required]    // rental end date
    });
  }

  ngOnInit(): void {
    this.getCars();              // get available cars
  }

  // get available cars
  getCars() {
    this.http.getCars().subscribe(
      res => this.carList = res,
      () => this.errorMessage = 'Unable to fetch cars'
    );
  }

  // select car for booking
  book(val: any) {
    this.toBook = val;
  }

  // submit booking request
  onSubmit() {

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const start = this.datePipe.transform(
      this.itemForm.value.rentalStartDate,
      'yyyy-MM-ddTHH:mm:ss'
    );

    const end = this.datePipe.transform(
      this.itemForm.value.rentalEndDate,
      'yyyy-MM-ddTHH:mm:ss'
    );

    // booking payload
    const payload = {
      rentalStartDate: start,
      rentalEndDate: end
    };

    const userId = localStorage.getItem('userid'); // customer id
    const carId = this.toBook.id;                  // car id

    // book car
    this.http.bookACar(payload, userId, carId).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = "Car booked successfully.";
        this.itemForm.reset();
        this.getCars();         // refresh car list
      },
      () => {
        this.showError = true;
        this.errorMessage = "Booking failed.";
      }
    );
  }
}