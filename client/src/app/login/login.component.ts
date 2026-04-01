import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  itemForm!: FormGroup;
  showError = false;
  errorMessage = '';
  isLoading = false;
  registrationSuccess = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'success') {
        this.registrationSuccess = true;
      }
    });
  }

  onLogin(): void {
  this.showError = false;

  if (this.itemForm.invalid) {
    this.itemForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  this.http.Login(this.itemForm.value).subscribe(
    (res: any) => {
      this.isLoading = false;
      console.log('LOGIN RESPONSE:', res); // ADD THIS LINE

      if (res && res.token) {
        this.auth.saveToken(res.token);
        this.auth.SetRole(res.role);
        this.auth.saveUserId(res.userId);
        this.router.navigate(['/dashboard']);
      } else {
        // ADD THIS so you see if login succeeds but token key is wrong
        this.showError = true;
        this.errorMessage = 'Login succeeded but token not found. Check console.';
      }
    },
    (err) => {
      this.isLoading = false;
      this.showError = true;
      console.log('LOGIN ERROR:', err); // ADD THIS LINE
      this.errorMessage = 'Invalid username or password.';
    }
  );
}
}