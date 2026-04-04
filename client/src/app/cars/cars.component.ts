import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('rentalStartDate')?.value;
  const end   = group.get('rentalEndDate')?.value;
  if (start && end && new Date(end) < new Date(start)) {
    return { dateRangeInvalid: true };
  }
  return null;
}

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {

  carList:         any[]    = [];
  toBook:          any      = null;
  itemForm!:       FormGroup;
  today:           string   = '';
  searchQuery:     string   = '';

  showBookingForm: boolean  = false;
  isTableLoading:  boolean  = false;
  isLoading:       boolean  = false;
  showMessage:     boolean  = false;
  showError:       boolean  = false;
  responseMessage: string   = '';
  errorMessage:    string   = '';

  // License popup
  showLicensePopup:  boolean = false;
  licenseNumber:     string  = '';
  licenseError:      string  = '';
  licenseValid:      boolean = false;
  pendingBookingCar: any     = null;

  constructor(
    private fb:   FormBuilder,
    private http: HttpService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.buildForm();
    this.getCars();
  }

  buildForm(): void {
    this.itemForm = this.fb.group(
      {
        rentalStartDate: ['', Validators.required],
        rentalEndDate:   ['', Validators.required]
      },
      { validators: dateRangeValidator }
    );

    this.itemForm.get('rentalStartDate')!.valueChanges.subscribe(() => {
      this.itemForm.get('rentalEndDate')!.updateValueAndValidity();
    });
  }

  getMinEndDate(): string {
    const start = this.itemForm.get('rentalStartDate')?.value;
    if (!start) return this.today;
    const next = new Date(start);
    next.setDate(next.getDate() + 1);
    return next.toISOString().split('T')[0];
  }

  getDayCount(): number {
    const start = this.itemForm.get('rentalStartDate')?.value;
    const end   = this.itemForm.get('rentalEndDate')?.value;
    if (!start || !end) return 0;
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }

  getEstimatedCost(): number {
    const rate = this.toBook?.rentalRatePerDay ?? 0;
    return this.getDayCount() * rate;
  }

  filteredCars(): any[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.carList;
    return this.carList.filter(c =>
      (c.make + ' ' + c.model).toLowerCase().includes(q) ||
      (c.registrationNumber ?? '').toLowerCase().includes(q)
    );
  }

  getCars(): void {
    this.isTableLoading = true;
    this.showError      = false;

    this.http.getCars().subscribe(
      (res: any) => {
        this.carList        = res ?? [];
        this.isTableLoading = false;
      },
      (err: any) => {
        this.isTableLoading = false;
        this.showError      = true;
        this.errorMessage   = 'Failed to load available cars.';
      }
    );
  }

  // ── License popup trigger ────────────────────────────────────
  book(car: any): void {
    this.pendingBookingCar = car;
    this.licenseNumber     = '';
    this.licenseError      = '';
    this.licenseValid      = false;
    this.showLicensePopup  = true;
  }

  // ── Validate license format: DL-XXXXXX (DL- followed by 6 digits) ──
  validateLicenseFormat(): boolean {
    const pattern = /^DL-\d{6}$/;
    return pattern.test(this.licenseNumber.trim());
  }

  onLicenseInput(): void {
    this.licenseError = '';
    if (this.licenseNumber.trim().length > 0) {
      this.licenseValid = this.validateLicenseFormat();
    } else {
      this.licenseValid = false;
    }
  }

  confirmLicense(): void {
    if (!this.licenseNumber.trim()) {
      this.licenseError = 'Please enter your driving license number.';
      return;
    }
    if (!this.validateLicenseFormat()) {
      this.licenseError = 'Invalid license. Use DL-XXXXXX (e.g. DL-987654).';
      return;
    }
    // License valid — proceed to booking form
    this.showLicensePopup  = false;
    this.toBook            = this.pendingBookingCar;
    this.pendingBookingCar = null;
    this.showBookingForm   = true;
    this.showMessage       = false;
    this.showError         = false;
    this.itemForm.reset();
  }

  closeLicensePopup(): void {
    this.showLicensePopup  = false;
    this.pendingBookingCar = null;
    this.licenseNumber     = '';
    this.licenseError      = '';
    this.licenseValid      = false;
  }

  cancelBooking(): void {
    this.showBookingForm = false;
    this.toBook          = null;
    this.itemForm.reset();
    this.showMessage     = false;
    this.showError       = false;
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading   = true;
    this.showMessage = false;
    this.showError   = false;

    const start = this.itemForm.value.rentalStartDate;
    const end   = this.itemForm.value.rentalEndDate;

    const details = {
      rentalStartDate: start + 'T00:00:00',
      rentalEndDate:   end   + 'T23:59:59'
    };

    const userId = this.auth.getUserId();
    const carId  = this.toBook.id;

    this.http.bookACar(details, userId, carId).subscribe(
      (res: any) => {
        this.isLoading       = false;
        this.showMessage     = true;
        this.responseMessage = 'Booking confirmed! Your car is reserved.';
        this.itemForm.reset();
        this.toBook          = null;
        this.showBookingForm = false;
        this.getCars();
        setTimeout(() => (this.showMessage = false), 5000);
      },
      (err: any) => {
        this.isLoading    = false;
        this.showError    = true;
        this.errorMessage = 'Booking failed. Please try again.';
      }
    );
  }
}