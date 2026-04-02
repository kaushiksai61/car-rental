import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  carList: any = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  toBook: any = {};
  isLoading: boolean = false;
  isTableLoading: boolean = false;
  showBookingForm: boolean = false;
  today: string = '';

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {
    this.today = new Date().toISOString().split('T')[0];

    this.itemForm = this.fb.group(
      {
        rentalStartDate: ['', Validators.required],
        rentalEndDate:   ['', Validators.required]
      },
      { validators: this.dateRangeValidator }
    );
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('rentalStartDate')?.value;
    const end   = group.get('rentalEndDate')?.value;
    if (start && end && new Date(end) < new Date(start)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.getCars();
  }

  getCars(): void {
    this.isTableLoading = true;
    this.showError = false;
    this.http.getCars().subscribe(
      (res: any) => {
        this.carList = res;
        this.isTableLoading = false;
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Failed to load available cars. Please try again.';
        this.isTableLoading = false;
      }
    );
  }

  book(val: any): void {
    this.toBook = val;
    this.showBookingForm = true;
    this.showMessage = false;
    this.showError = false;
    this.itemForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelBooking(): void {
    this.showBookingForm = false;
    this.toBook = {};
    this.itemForm.reset();
    this.showMessage = false;
    this.showError = false;
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    if (this.itemForm.errors?.['dateRangeInvalid']) {
      return;
    }

    this.isLoading = true;
    this.showMessage = false;
    this.showError = false;

    const userId = this.auth.getUserId();
    const carId  = this.toBook.id;

    const formVal = this.itemForm.value;

    // Backend BookingDto expects "yyyy-MM-dd'T'HH:mm:ss" format
    // We send start date at 00:00:00 and end date at 23:59:59
    const startDate = formVal.rentalStartDate + 'T00:00:00';
    const endDate   = formVal.rentalEndDate   + 'T23:59:59';

    const payload = {
      rentalStartDate: startDate,
      rentalEndDate:   endDate
    };

    this.http.bookACar(payload, userId, carId).subscribe(
      () => {
        this.isLoading       = false;
        this.showMessage     = true;
        this.responseMessage = 'Car booked successfully!';
        this.itemForm.reset();
        this.toBook          = {};
        this.showBookingForm = false;
        this.getCars();
      },
      () => {
        this.isLoading    = false;
        this.showError    = true;
        this.errorMessage = 'Failed to book car. Please try again.';
      }
    );
  }

  getDayCount(): number {
    const start = this.itemForm.value.rentalStartDate;
    const end   = this.itemForm.value.rentalEndDate;
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getEstimatedCost(): number {
    return this.getDayCount() * (this.toBook?.rentalRatePerDay || 0);
  }

  getMinEndDate(): string {
    const start = this.itemForm.value.rentalStartDate;
    return start ? start : this.today;
  }
}