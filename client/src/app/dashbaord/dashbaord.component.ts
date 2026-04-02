import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {

  username: string | null = null; // logged in user id
  role: string | null = null;     // logged in user role

  constructor(
    private auth: AuthService,    // authentication service
    private router: Router        // router navigation
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();          // get user role
    this.username = localStorage.getItem('userid'); // get user id
  }

  // navigate to available cars
  goToCars() {
    this.router.navigate(['/cars']);
  }

  // navigate to add car
  goToAddCar() {
    this.router.navigate(['/add-car']);
  }

  // navigate to bookings
  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  // navigate to car categories
  goToCategories() {
    this.router.navigate(['/categories']);
  }

  // navigate to booking report
  goToBookingReport() {
    this.router.navigate(['/booking-report']);
  }

  // navigate to payment report
  goToPaymentReport() {
    this.router.navigate(['/payment-report']);
  }

  // generic navigation
  go(path: string) {
    this.router.navigateByUrl(path);
  }

  // logout user
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
