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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // get info from localStorage via AuthService
    this.role = this.auth.getRole();
    this.username = localStorage.getItem("userid"); // no separate username stored
  }

  logout() {
    this.auth.logout();
    window.location.reload();
  }
}