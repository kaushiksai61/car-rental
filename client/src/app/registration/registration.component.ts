import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  itemForm!: FormGroup;
  showMessage  = false;
  responseMessage = '';
  isLoading    = false;

  constructor(
    private fb:     FormBuilder,
    private http:   HttpService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
      ]],
      role: ['', Validators.required]
    });
  }

  // ── Password requirement checkers ──────────────────────────
  get pwd(): string {
    return this.itemForm.get('password')?.value || '';
  }

  get hasUppercase(): boolean  { return /[A-Z]/.test(this.pwd); }
  get hasNumber(): boolean     { return /\d/.test(this.pwd); }
  get hasSpecial(): boolean    { return /[^A-Za-z0-9]/.test(this.pwd); }
  get hasMinLength(): boolean  { return this.pwd.length >= 8; }

  get passwordTouched(): boolean {
    return this.itemForm.controls['password'].touched;
  }

  onRegister(): void {
    this.showMessage     = false;
    this.responseMessage = '';

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload  = { ...this.itemForm.value };

    this.http.registerUser(payload).subscribe(
      (res: any) => {
        this.isLoading       = false;
        this.showMessage     = true;
        this.responseMessage = 'Registered successfully. OTP has been sent to your email.';
        this.router.navigate(['/verify-otp'], {
          queryParams: { email: payload.email }
        });
      },
      (err: any) => {
        this.isLoading       = false;
        this.showMessage     = true;
        this.responseMessage =
          err?.error?.message || err?.error || 'Registration failed. Please try again.';
      }
    );
  }
}