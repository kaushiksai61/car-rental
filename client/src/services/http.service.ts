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


  Login(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/login',
      details,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  
  registerUser(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/register',
      details,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}