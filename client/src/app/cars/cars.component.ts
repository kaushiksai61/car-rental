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

  itemForm!: FormGroup;
  carList: any = [];
  toBook: any = {};
  showError = false;
  errorMessage: any;
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
      rentalStartDate: ['', Validators.required],
      rentalEndDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCars();
  }

  getCars() {
    this.http.getCars().subscribe(
      res => this.carList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch cars.";
      }
    );
  }

  book(val: any) {
    this.toBook = val;
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const start = this.datePipe.transform(this.itemForm.value.rentalStartDate, 'yyyy-MM-ddTHH:mm:ss');
    const end = this.datePipe.transform(this.itemForm.value.rentalEndDate, 'yyyy-MM-ddTHH:mm:ss');

    const payload = {
      rentalStartDate: start,
      rentalEndDate: end
    };

    const userId = localStorage.getItem('userid');
    const carId = this.toBook.id;

    this.http.bookACar(payload, userId, carId).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = "Car booked successfully.";
        this.itemForm.reset();
        this.getCars();
      },
      () => {
        this.showError = true;
        this.errorMessage = "Booking failed.";
      }
    );
  }
}