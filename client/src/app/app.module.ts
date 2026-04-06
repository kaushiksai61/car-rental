import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* AUTH */
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

/* ✅ OTP COMPONENTS */
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

/* DASHBOARD & FEATURES */
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { CategoryComponent } from './category/category.component';
import { AddCarComponent } from './add-car/add-car.component';
import { CarsComponent } from './cars/cars.component';
import { GetBookingsComponent } from './get-bookings/get-bookings.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

/* SHARED */
import { ChatbotComponent } from './chatbot/chatbot.component';
import { StatusFilterPipe, PaymentStatusFilterPipe } from './status-filter.pipe';
import { AuthService } from '../services/auth.service';

@NgModule({
  declarations: [
    AppComponent,

    /* AUTH */
    LoginComponent,
    RegistrationComponent,

    /* ✅ OTP */
    VerifyOtpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,

    /* MAIN APP */
    DashbaordComponent,
    CategoryComponent,
    AddCarComponent,
    CarsComponent,
    GetBookingsComponent,
    BookingReportComponent,
    PaymentReportComponent,
    MyBookingsComponent,

    /* SHARED */
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