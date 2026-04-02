import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null; // jwt token
  private isLoggedIn: boolean = false;  // login status

  constructor() {}

  // save jwt token
  saveToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
    this.isLoggedIn = true;
  }

  // get jwt token
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  // check login status
  getLoginStatus() {
    return localStorage.getItem("token") !== null;
  }

  // logout user
  logout() {
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userid");
    this.isLoggedIn = false;
  }

  // store user role
  SetRole(role: any) {
    localStorage.setItem("role", role);
  }

  // get user role
  getRole() {
    return localStorage.getItem("role");
  }

  // store user id
  saveUserId(userid: any) {
    localStorage.setItem("userid", userid);
  }

  // get user id
  getUserId() {
    return localStorage.getItem("userid");
  }
}