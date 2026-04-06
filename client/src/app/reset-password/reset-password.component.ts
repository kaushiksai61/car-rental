import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;
  isLoading = false;
  showMessage = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'] || '';
      if (email) this.form.patchValue({ email });
    });
  }

  onReset(): void {
    this.showMessage = false;
    this.message = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.http.resetPassword({
      email: this.form.value.email,
      otp: this.form.value.otp,
      newPassword: this.form.value.newPassword
    }).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.showMessage = true;
        this.message = typeof res === 'string' ? res : 'Password updated successfully.';
        this.router.navigate(['/login']);
      },
      (err: any) => {
        this.isLoading = false;
        this.showMessage = true;
        this.message = (err && err.error)
          ? (typeof err.error === 'string' ? err.error : 'Reset failed.')
          : 'Reset failed.';
      }
    );
  }
}