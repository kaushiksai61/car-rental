import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { CategoryComponent } from './category/category.component';
import { AddCarComponent } from './add-car/add-car.component';
import { CarsComponent } from './cars/cars.component';
import { GetBookingsComponent } from './get-bookings/get-bookings.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

/* ✅ NEW OTP COMPONENTS */
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  /* AUTH */
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  /* ✅ OTP FLOW */
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  /* MAIN APP */
  { path: 'dashboard', component: DashbaordComponent },
  { path: 'cars', component: CarsComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'add-car', component: AddCarComponent },
  { path: 'bookings', component: GetBookingsComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'booking-report', component: BookingReportComponent },
  { path: 'payment-report', component: PaymentReportComponent },

  /* FALLBACK */
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}