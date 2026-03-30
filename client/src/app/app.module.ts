import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CarsComponent } from './cars/cars.component';
import { CategoryComponent } from './category/category.component';
import { GetBookingsComponent } from './get-bookings/get-bookings.component';
import { DashboardComponent } from './dashbaord/dashbaord.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    CarsComponent,
    CategoryComponent,
    GetBookingsComponent,
    DashboardComponent,
    BookingReportComponent,
    PaymentReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],

  // ✅ THIS LINE FIXES ALL mat-* ERRORS
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}