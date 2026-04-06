import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  form!: FormGroup;
  isLoading = false;
  showMessage = false;
  message = '';
  emailFromRoute = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.emailFromRoute = params['email'] || '';
      if (this.emailFromRoute) {
        this.form.patchValue({
          email: this.normalizeEmail(this.emailFromRoute)
        });
      }
    });
  }

  // =====================
  // VERIFY OTP
  // =====================
  onVerify(): void {
    this.showMessage = false;
    this.message = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.normalizeEmail(this.form.value.email),
      otp: this.form.value.otp.trim()
    };

    this.isLoading = true;

    this.http.verifyEmailOtp(payload).subscribe(
      () => {
        this.isLoading = false;
        this.showMessage = true;
        this.message = 'Email verified successfully. You can login now.';

        this.router.navigate(['/login'], {
          queryParams: { verified: 'success' }
        });
      },
      (err: any) => {
        this.isLoading = false;
        this.showMessage = true;
        this.message =
          err?.error?.message ||
          err?.error ||
          'OTP verification failed.';
      }
    );
  }

  // =====================
  // RESEND OTP
  // =====================
  onResend(): void {
    this.showMessage = false;
    this.message = '';

    const email = this.normalizeEmail(this.form.value.email);
    if (!email) {
      this.showMessage = true;
      this.message = 'Please enter your email first.';
      return;
    }

    this.isLoading = true;

    this.http.resendOtp({ email }).subscribe(
      () => {
        this.isLoading = false;
        this.showMessage = true;
        this.message = 'OTP resent successfully. Please check your email.';
      },
      (err: any) => {
        this.isLoading = false;
        this.showMessage = true;
        this.message =
          err?.error?.message ||
          err?.error ||
          'Failed to resend OTP.';
      }
    );
  }

  private normalizeEmail(email: string): string {
    return email ? email.trim().toLowerCase() : '';
  }
}