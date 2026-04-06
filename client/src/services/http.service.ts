import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public serverName = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.authService.getToken(),
        'Content-Type': 'application/json'
      })
    };
  }

  private jsonHeaders() {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  // ── CATEGORY (ADMIN) ──────────────────────────────────────
  getAllCategories(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/administrator/car-categories',
      this.getHeaders()
    );
  }

  createCategory(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/administrator/car-categories',
      details,
      this.getHeaders()
    );
  }

  updateCategory(details: any, id: any): Observable<any> {
    return this.http.put(
      this.serverName + `/api/administrator/car-categories/${id}`,
      details,
      this.getHeaders()
    );
  }

  // ── ADMIN REPORTS ─────────────────────────────────────────
  getBookingReport(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/administrator/reports/bookings',
      this.getHeaders()
    );
  }

  paymentReport(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/administrator/reports/payments',
      this.getHeaders()
    );
  }

  // ── AGENT CAR MANAGEMENT ──────────────────────────────────
  getAllCars(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/agent/cars',
      this.getHeaders()
    );
  }

  createCar(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/agent/car',
      details,
      this.getHeaders()
    );
  }

  updateCar(details: any, id: any): Observable<any> {
    return this.http.put(
      this.serverName + `/api/agent/car/${id}`,
      details,
      this.getHeaders()
    );
  }

  getAgentCategories(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/agent/categories',
      this.getHeaders()
    );
  }

  // ── AGENT BOOKINGS ────────────────────────────────────────
  getBookingByAgent(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/agent/bookings',
      this.getHeaders()
    );
  }

  updateBookingStatus(id: any): Observable<any> {
    return this.http.put(
      this.serverName + `/api/agent/bookings/${id}/status?status=booked`,
      {},
      this.getHeaders()
    );
  }

  bookingPayment(details: any, id: any): Observable<any> {
    return this.http.post(
      this.serverName + `/api/agent/payment/${id}`,
      details,
      this.getHeaders()
    );
  }

  // ── CUSTOMER ──────────────────────────────────────────────
  getCars(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/customers/cars/available',
      this.getHeaders()
    );
  }

  bookACar(details: any, userId: any, carId: any): Observable<any> {
    return this.http.post(
      this.serverName + `/api/customers/booking?userId=${userId}&carId=${carId}`,
      details,
      this.getHeaders()
    );
  }

  getMyBookings(userId: any): Observable<any> {
    return this.http.get(
      this.serverName + `/api/customers/bookings/${userId}`,
      this.getHeaders()
    );
  }

  // ── AUTH ──────────────────────────────────────────────────
  Login(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/login',
      details,
      this.jsonHeaders()
    );
  }

  registerUser(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/register',
      details,
      this.jsonHeaders()
    );
  }

  // ── OTP (OPTION B) ────────────────────────────────────────
  verifyEmailOtp(details: { email: string; otp: string }): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/verify-email-otp',
      details,
      this.jsonHeaders()
    );
  }

  forgotPassword(details: { email: string }): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/forgot-password',
      details,
      this.jsonHeaders()
    );
  }

  resetPassword(details: { email: string; otp: string; newPassword: string }): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/reset-password',
      details,
      this.jsonHeaders()
    );
  }

  resendOtp(details: { email: string }): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/resend-otp',
      details,
      this.jsonHeaders()
    );
  }
}