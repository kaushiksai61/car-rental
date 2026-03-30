import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpService {

  private baseUrl = 'http://localhost:9876/context.html/api';

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer mockToken'
      })
    };
  }

  getAllCategories() {
    return this.http.get(`${this.baseUrl}/administrator/car-categories`, this.headers());
  }

  getBookingByAgent() {
    return this.http.get(`${this.baseUrl}/agent/bookings`, this.headers());
  }

  paymentReport() {
    return this.http.get(`${this.baseUrl}/administrator/reports/payments`, this.headers());
  }

  getBookingReport() {
    return this.http.get(`${this.baseUrl}/administrator/reports/bookings`, this.headers());
  }

  getCars() {
    return this.http.get(`${this.baseUrl}/customers/cars/available`, this.headers());
  }

  bookACar(details: any, userId: any, carId: any) {
    return this.http.post(
      `${this.baseUrl}/customers/booking?userId=${userId}&carId=${carId}`,
      details,
      this.headers()
    );
  }

  bookingPayment(details: any, bookingId: any) {
    return this.http.post(
      `${this.baseUrl}/agent/payment/${bookingId}`,
      details,
      this.headers()
    );
  }

  updateBookingStatus(bookingId: any) {
    return this.http.put(
      `${this.baseUrl}/agent/bookings/${bookingId}/status?status=booked`,
      {},
      this.headers()
    );
  }

  updateCar(details: any, id: any) {
    return this.http.put(`${this.baseUrl}/agent/car/${id}`, details, this.headers());
  }

  createCar(details: any) {
    return this.http.post(`${this.baseUrl}/agent/car`, details, this.headers());
  }

  createCategory(details: any) {
    return this.http.post(`${this.baseUrl}/administrator/car-categories`, details, this.headers());
  }

  updateCategory(details: any, id: any) {
    return this.http.put(
      `${this.baseUrl}/administrator/car-categories/${id}`,
      details,
      this.headers()
    );
  }

  /** 🔴 Special case: Login & Register need Content-Type */
  Login(details: any) {
    return this.http.post(
      `${this.baseUrl}/user/login`,
      details,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  registerUser(details: any) {
    return this.http.post(
      `${this.baseUrl}/user/register`,
      details,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }
}
