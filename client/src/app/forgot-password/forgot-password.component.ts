import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  form!: FormGroup;
  isLoading = false;
  showMessage = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSendOtp(): void {
    this.showMessage = false;
    this.message = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const email = this.form.value.email;

    this.http.forgotPassword({ email }).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.showMessage = true;
        this.message = typeof res === 'string' ? res : 'OTP sent to email.';
        this.router.navigate(['/reset-password'], { queryParams: { email } });
      },
      (err: any) => {
        this.isLoading = false;
        this.showMessage = true;
        this.message = (err && err.error)
          ? (typeof err.error === 'string' ? err.error : 'Failed to send OTP.')
          : 'Failed to send OTP.';
      }
    );
  }
}