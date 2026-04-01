import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {

  username: string | null = null;
  role: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.username = localStorage.getItem('userid');
  }

  goToCars() {
    this.router.navigate(['/cars']);
  }

  goToAddCar() {
    this.router.navigate(['/add-car']);
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  goToCategories() {
    this.router.navigate(['/categories']);
  }

  goToBookingReport() {
    this.router.navigate(['/booking-report']);
  }

  goToPaymentReport() {
    this.router.navigate(['/payment-report']);
  }
  
go(path: string) {
  this.router.navigateByUrl(path);
}


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
