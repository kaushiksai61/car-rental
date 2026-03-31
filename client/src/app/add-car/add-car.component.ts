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

  itemForm!: FormGroup;
  categoryList: any[] = [];
  carList: any[] = [];
  updateId: any = null;

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
      make: ['', Validators.required],
      model: ['', Validators.required],
      manufactureYear: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      status: ['', Validators.required],
      rentalRatePerDay: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getCars();
  }

  getCategories() {
    this.http.getAllCategories().subscribe(
      (res) => this.categoryList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch categories.";
      }
    );
  }

  getCars() {
    this.http.getAllCars().subscribe(
      (res) => this.carList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Unable to fetch cars.";
      }
    );
  }

  editCar(car: any) {
    this.updateId = car.id;

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

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const payload = this.itemForm.value;

    if (this.updateId) {
      this.http.updateCar(payload, this.updateId).subscribe(
        () => this.afterSave("Car updated successfully."),
        () => this.errorHandler("Failed to update car.")
      );
    } else {
      this.http.createCar(payload).subscribe(
        () => this.afterSave("Car created successfully."),
        () => this.errorHandler("Failed to create car.")
      );
    }
  }

  afterSave(msg: string) {
    this.showMessage = true;
    this.responseMessage = msg;
    this.itemForm.reset();
    this.updateId = null;

    this.getCars();
  }

  errorHandler(msg: string) {
    this.showError = true;
    this.errorMessage = msg;
  }
}