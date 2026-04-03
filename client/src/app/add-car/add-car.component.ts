import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  showError: boolean = false;
  errorMessage: any;
  categoryList: any[] = [];
  carList: any[] = [];
  showMessage: boolean = false;
  responseMessage: any;
  updateId: any;
  isLoading: boolean = false;
  isTableLoading: boolean = false;

  // Indian car brands and models
  carBrands: any[] = [
    { make: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire', 'Alto', 'Wagon R', 'Ciaz'] },
    { make: 'Hyundai',       models: ['Creta', 'i20', 'Venue', 'Verna', 'Tucson', 'Alcazar', 'Aura'] },
    { make: 'Tata',          models: ['Nexon', 'Harrier', 'Safari', 'Punch', 'Tiago', 'Tigor', 'Altroz'] },
    { make: 'Mahindra',      models: ['Scorpio', 'XUV700', 'XUV300', 'Thar', 'Bolero', 'BE 6e'] },
    { make: 'Toyota',        models: ['Innova Crysta', 'Fortuner', 'Camry', 'Urban Cruiser', 'Glanza'] },
    { make: 'Honda',         models: ['City', 'Amaze', 'Jazz', 'WR-V', 'Elevate'] },
    { make: 'Kia',           models: ['Seltos', 'Sonet', 'Carens', 'EV6'] },
    { make: 'Renault',       models: ['Kwid', 'Triber', 'Kiger', 'Duster'] },
    { make: 'Volkswagen',    models: ['Polo', 'Vento', 'Taigun', 'Virtus'] },
    { make: 'Skoda',         models: ['Rapid', 'Octavia', 'Kushaq', 'Slavia', 'Superb'] },
    { make: 'MG',            models: ['Hector', 'ZS EV', 'Astor', 'Gloster'] },
    { make: 'Nissan',        models: ['Magnite', 'Kicks', 'Sunny'] },
    { make: 'Ford',          models: ['EcoSport', 'Endeavour', 'Figo', 'Freestyle'] },
    { make: 'Jeep',          models: ['Compass', 'Meridian', 'Wrangler'] },
    { make: 'BMW',           models: ['3 Series', '5 Series', 'X1', 'X3', 'X5'] }
  ];

  availableModels: string[] = [];
  makeNames: string[] = [];

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.makeNames = this.carBrands.map(b => b.make);

    this.itemForm = this.fb.group({
      make:               ['', Validators.required],
      model:              ['', Validators.required],
      manufactureYear:    ['', [Validators.required, this.yearValidator]],
      registrationNumber: ['', [Validators.required, this.regNumberValidator]],
      status:             ['', Validators.required],
      rentalRatePerDay:   ['', [Validators.required, Validators.min(1)]],
      category:           [null],
      id:                 ['']
    });

    // When make changes, update model dropdown
    this.itemForm.get('make')!.valueChanges.subscribe(make => {
      const brand = this.carBrands.find(b => b.make === make);
      this.availableModels = brand ? brand.models : [];
      this.itemForm.get('model')!.setValue('');
    });
  }

  // Validator: year must be 4 digits between 1980 and current year
  yearValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return null;
    const year = parseInt(val, 10);
    const current = new Date().getFullYear();
    if (!/^\d{4}$/.test(val.toString())) return { invalidYear: 'Must be a 4-digit year' };
    if (year < 1980) return { invalidYear: 'Year must be 1980 or later' };
    if (year > current) return { invalidYear: `Year cannot exceed ${current}` };
    return null;
  }

  // Validator: format must be XX 00 XX 0000 (2 letters, space, 2 digits, 2 letters, 4 digits)
  regNumberValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return null;
    const pattern = /^[A-Za-z]{2}\d{2}\s[A-Za-z]{2}\s\d{4}$/;
    if (!pattern.test(val)) {
      return { invalidReg: 'Format: TN 08 AB 1234' };
    }
    return null;
  }

  ngOnInit(): void {
    this.getAllCarList();
    this.getCategoryList();
  }

  getCategoryList(): void {
    this.http.getAgentCategories().subscribe(
      (res: any) => { this.categoryList = res || []; },
      () => { this.categoryList = []; }
    );
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
        this.errorMessage = 'Failed to load cars.';
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

    const formVal = this.itemForm.value;
    const payload: any = {
      make:               formVal.make,
      model:              formVal.model,
      manufactureYear:    formVal.manufactureYear,
      registrationNumber: formVal.registrationNumber.toUpperCase(),
      status:             formVal.status,
      rentalRatePerDay:   formVal.rentalRatePerDay
    };

    if (formVal.category) {
      payload.category = { id: formVal.category };
    }

    if (this.updateId) {
      this.http.updateCar(payload, this.updateId).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = 'Car updated successfully.';
          this.resetForm();
          this.getAllCarList();
        },
        () => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = 'Failed to update car.';
        }
      );
    } else {
      this.http.createCar(payload).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = 'Car added successfully.';
          this.resetForm();
          this.getAllCarList();
        },
        () => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = 'Failed to add car.';
        }
      );
    }
  }

  editCar(val: any): void {
    this.updateId = val.id;
    // Set make first so models populate
    const brand = this.carBrands.find(b => b.make === val.make);
    this.availableModels = brand ? brand.models : [];

    this.itemForm.patchValue({
      make:               val.make,
      model:              val.model,
      manufactureYear:    val.manufactureYear,
      registrationNumber: val.registrationNumber,
      status:             val.status,
      rentalRatePerDay:   val.rentalRatePerDay,
      category:           val.category?.id || null
    });
    this.showMessage = false;
    this.showError = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.updateId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.itemForm.reset();
    this.availableModels = [];
    this.showMessage = false;
    this.showError = false;
    this.updateId = null;
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-unknown';
    switch (status.toLowerCase()) {
      case 'available': return 'status-available';
      case 'booked':    return 'status-booked';
      default:          return 'status-unknown';
    }
  }

  getCategoryName(car: any): string {
    if (car.category && car.category.name) return car.category.name;
    return '—';
  }
}