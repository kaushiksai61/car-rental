import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public serverName = environment.apiUrl; // backend api url

  constructor(
    private http: HttpClient,             // http client
    private authService: AuthService      // auth service
  ) {}

  // get authorization headers
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.authService.getToken(),
        'Content-Type': 'application/json'
      })
    };
  }

  /* ================= ADMINISTRATOR APIS ================= */

  // get all car categories
  getAllCategories(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/administrator/car-categories',
      this.getHeaders()
    );
  }

  // create car category
  createCategory(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/administrator/car-categories',
      details,
      this.getHeaders()
    );
  }

  // update car category
  updateCategory(details: any, id: any): Observable<any> {
    return this.http.put(
      this.serverName + `/api/administrator/car-categories/${id}`,
      details,
      this.getHeaders()
    );
  }

  // get booking report
  getBookingReport(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/administrator/reports/bookings',
      this.getHeaders()
    );
  }

  // get payment report
  paymentReport(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/administrator/reports/payments',
      this.getHeaders()
    );
  }

  /* ================= AGENT APIS ================= */

  // get all cars
  getAllCars(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/agent/cars',
      this.getHeaders()
    );
  }

  // add car
  createCar(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/agent/car',
      details,
      this.getHeaders()
    );
  }

  // update car details
  updateCar(details: any, id: any): Observable<any> {
    return this.http.put(
      this.serverName + `/api/agent/car/${id}`,
      details,
      this.getHeaders()
    );
  }

  // get all bookings
  getBookingByAgent(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/agent/bookings',
      this.getHeaders()
    );
  }

  // update booking status
  updateBookingStatus(id: any): Observable<any> {
    return this.http.put(
      this.serverName + `/api/agent/bookings/${id}/status?status=booked`,
      {},
      this.getHeaders()
    );
  }

  // create payment for booking
  bookingPayment(details: any, id: any): Observable<any> {
    return this.http.post(
      this.serverName + `/api/agent/payment/${id}`,
      details,
      this.getHeaders()
    );
  }

  /* ================= CUSTOMER APIS ================= */

  // get available cars
  getCars(): Observable<any> {
    return this.http.get(
      this.serverName + '/api/customers/cars/available',
      this.getHeaders()
    );
  }

  // book a car
  bookACar(details: any, userId: any, carId: any): Observable<any> {
    return this.http.post(
      this.serverName + `/api/customers/booking?userId=${userId}&carId=${carId}`,
      details,
      this.getHeaders()
    );
  }

  /* ================= USER AUTH APIS ================= */

  // login user
  Login(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/login',
      details,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  // register user
  registerUser(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/register',
      details,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}