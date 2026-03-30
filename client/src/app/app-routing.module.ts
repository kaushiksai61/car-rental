import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { CarsComponent } from './cars/cars.component';
import { AddCarComponent } from './add-car/add-car.component';
import { CategoryComponent } from './category/category.component';
import { GetBookingsComponent } from './get-bookings/get-bookings.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';

const routes: Routes = [

  // ✅ Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },

  // ✅ Dashboard
  // { path: 'dashboard', component: DashboardComponent },

  // ✅ Customer routes
  { path: 'cars', component: CarsComponent },

  // ✅ Agent routes
  { path: 'add-car', component: AddCarComponent },
  { path: 'bookings', component: GetBookingsComponent },

  // ✅ Admin routes
  { path: 'categories', component: CategoryComponent },
  { path: 'booking-report', component: BookingReportComponent },
  { path: 'payment-report', component: PaymentReportComponent },

  // ✅ Fallback
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }