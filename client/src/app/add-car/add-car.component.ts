import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  categoryList: any = [];
  assignModel: any = {};
  carList: any = [];
  showMessage: any;
  responseMessage: any;
  updateId: any;
  isLoading: boolean = false;
  isTableLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.itemForm = this.fb.group({
      make:               ['', Validators.required],
      model:              ['', Validators.required],
      manufactureYear:    ['', Validators.required],
      registrationNumber: ['', Validators.required],
      status:             ['', Validators.required],
      rentalRatePerDay:   ['', Validators.required],
      id:                 ['']
    });
  }

  ngOnInit(): void {
    this.getAllCarList();
  }

  getAllCarList(): void {
    this.isTableLoading = true;
    this.http.getAllCars().subscribe(
      (res: any) => {
        this.carList = res;
        this.isTableLoading = false;
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Failed to load cars. Please try again.';
        this.isTableLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.showMessage = false;
    this.showError = false;

    if (this.updateId) {
      this.http.updateCar(this.itemForm.value, this.updateId).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = 'Car updated successfully.';
          this.itemForm.reset();
          this.updateId = null;
          this.getAllCarList();
        },
        () => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = 'Failed to update car. Please try again.';
        }
      );
    } else {
      this.http.createCar(this.itemForm.value).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = 'Car added successfully.';
          this.itemForm.reset();
          this.getAllCarList();
        },
        () => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = 'Failed to add car. Please try again.';
        }
      );
    }
  }

  editCar(val: any): void {
    this.updateId = val.id;
    this.itemForm.patchValue(val);
    this.showMessage = false;
    this.showError = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.updateId = null;
    this.itemForm.reset();
    this.showMessage = false;
    this.showError = false;
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-unknown';
    switch (status.toLowerCase()) {
      case 'available': return 'status-available';
      case 'booked':    return 'status-booked';
      default:          return 'status-unknown';
    }
  }
}