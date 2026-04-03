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

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',          component: LoginComponent },
  { path: 'registration',   component: RegistrationComponent },
  { path: 'dashboard',      component: DashbaordComponent },
  { path: 'cars',           component: CarsComponent },
  { path: 'my-bookings',    component: MyBookingsComponent },
  { path: 'add-car',        component: AddCarComponent },
  { path: 'bookings',       component: GetBookingsComponent },
  { path: 'categories',     component: CategoryComponent },
  { path: 'booking-report', component: BookingReportComponent },
  { path: 'payment-report', component: PaymentReportComponent },
  { path: '**',             redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}