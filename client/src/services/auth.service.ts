import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isLoggedIn: boolean = false;
  constructor() {}
  saveToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
    this.isLoggedIn = true;
  }
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }
  getLoginStatus() {
    return localStorage.getItem("token") !== null;
  }
  logout() {
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userid");
    this.isLoggedIn = false;
  }
  SetRole(role: any) {
    localStorage.setItem("role", role);
  }
  getRole() {
    return localStorage.getItem("role");
  }
  saveUserId(userid: any) {
    localStorage.setItem("userid", userid);
  }
  getUserId() {
    return localStorage.getItem("userid");
  }
}