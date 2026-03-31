import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  IsLoggin = false;
  roleName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.refreshAuthState();
  }

  refreshAuthState() {
    this.IsLoggin = this.authService.getLoginStatus();
    this.roleName = this.authService.getRole();
  }

  isAuthPage(): boolean {
  return this.router.url === '/login' || this.router.url === '/registration';
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
