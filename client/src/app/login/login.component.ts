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

  itemForm!: FormGroup;
  showError = false;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.http.Login(this.itemForm.value).subscribe(
      (res: any) => {
        if (res && res.token) {
          this.auth.saveToken(res.token);
          this.auth.SetRole(res.role);
          this.auth.saveUserId(res.userId);
          this.router.navigate(['/dashboard']);
        }
      },
      () => {
        this.showError = true;
        this.errorMessage = "Invalid username or password.";
      }
    );
  }
}