import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {

  itemForm!: FormGroup;              // reactive form for add/update car
  categoryList: any[] = [];           // car category list
  carList: any[] = [];                // list of cars
  updateId: any = null;               // car id for update

  showError = false;                  // error flag
  errorMessage: any;                  // error message

  showMessage = false;                // success flag
  responseMessage: any;               // success message

  constructor(
    private fb: FormBuilder,          // form builder
    private router: Router,            // router navigation
    private http: HttpService,         // http service
    private auth: AuthService,         // auth service
    private datePipe: DatePipe         // date formatter
  ) {
    // reactive form initialization
    this.itemForm = this.fb.group({
      make: ['', Validators.required],                // car make
      model: ['', Validators.required],               // car model
      manufactureYear: ['', Validators.required],     // manufacture year
      registrationNumber: ['', Validators.required],  // registration number
      status: ['', Validators.required],              // car status
      rentalRatePerDay: ['', Validators.required],    // rental rate per day
      categoryId: ['', Validators.required]            // car category
    });
  }

  ngOnInit(): void {
    this.getCategories();               // get car categories
    this.getCars();                     // get all cars
  }

  // get all car categories
  getCategories() {
    this.http.getAllCategories().subscribe(
      (res) => this.categoryList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch categories.";
      }
    );
  }

  // get all cars
  getCars() {
    this.http.getAllCars().subscribe(
      (res) => this.carList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch cars.";
      }
    );
  }

  // edit car details
  editCar(car: any) {
    this.updateId = car.id;             // set update car id

    this.itemForm.patchValue({
      make: car.make,
      model: car.model,
      manufactureYear: car.manufactureYear,
      registrationNumber: car.registrationNumber,
      status: car.status,
      rentalRatePerDay: car.rentalRatePerDay,
      categoryId: car.category?.id
    });
  }

  // submit add or update car
  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const payload = this.itemForm.value;

    if (this.updateId) {
      // update car details
      this.http.updateCar(payload, this.updateId).subscribe(
        () => this.afterSave("Car updated successfully."),
        () => this.errorHandler("Failed to update car.")
      );
    } else {
      // create new car
      this.http.createCar(payload).subscribe(
        () => this.afterSave("Car created successfully."),
        () => this.errorHandler("Failed to create car.")
      );
    }
  }

  // post save actions
  afterSave(msg: string) {
    this.showMessage = true;
    this.responseMessage = msg;
    this.itemForm.reset();
    this.updateId = null;

    this.getCars();                     // refresh car list
  }

  // handle error message
  errorHandler(msg: string) {
    this.showError = true;
    this.errorMessage = msg;
  }
}