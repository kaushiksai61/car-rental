import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, CommonModule } from '@angular/common';
import { ChatbotComponent } from './chatbot/chatbot.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AuthService } from '../services/auth.service';
import { StatusFilterPipe, PaymentStatusFilterPipe } from './status-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashbaordComponent,
    CategoryComponent,
    AddCarComponent,
    CarsComponent,
    GetBookingsComponent,
    BookingReportComponent,
    PaymentReportComponent,
    MyBookingsComponent,
    StatusFilterPipe,
    PaymentStatusFilterPipe,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}