import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  itemForm!: FormGroup;        // reactive form for login
  showError = false;           // error flag
  errorMessage: any;           // error message

  constructor(
    private fb: FormBuilder,   // form builder
    private http: HttpService, // http service
    private auth: AuthService, // auth service
    private router: Router     // router navigation
  ) {
    // login form initialization
    this.itemForm = this.fb.group({
      username: ['', Validators.required], // username
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            // password validation pattern
            '^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$'
          )
        ]
      ]
    });
  }

  // login user
  onLogin() {

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    // call login api
    this.http.Login(this.itemForm.value).subscribe(
      (res: any) => {
        if (res && res.token) {

          // save jwt token
          this.auth.saveToken(res.token);

          // save user role
          this.auth.SetRole(res.role);

          // save user id
          this.auth.saveUserId(res.userId);

          // navigate to dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Invalid username or password.';
      }
    );
  }
}