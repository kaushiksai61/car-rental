import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  IsLoggin: boolean = false;
  roleName: string | null = null;
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.IsLoggin = this.authService.getLoginStatus();
    this.roleName = this.authService.getRole();

    // Re-check login status on every route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.IsLoggin = this.authService.getLoginStatus();
        this.roleName = this.authService.getRole();
      }
    });

    if (!this.IsLoggin) {
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.authService.logout();
    this.IsLoggin = false;
    this.roleName = null;
    this.router.navigateByUrl('/login');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}