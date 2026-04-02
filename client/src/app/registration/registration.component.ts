import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  itemForm!: FormGroup;        // reactive form for user registration
  showMessage = false;         // success flag
  responseMessage: any;        // success message

  constructor(private fb: FormBuilder, private http: HttpService) {

    // registration form initialization
    this.itemForm = this.fb.group({
      username: ['', Validators.required],             // username
      email: ['', [Validators.required, Validators.email]], // email
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            // password validation pattern
            '^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$'
          )
        ]
      ],
      role: ['', Validators.required]                  // user role
    });
  }

  // register user
  onRegister() {

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    // registration payload
    const payload = {
      ...this.itemForm.value,

      // map ADMIN to ADMINISTRATOR
      role:
        this.itemForm.value.role === 'ADMIN'
          ? 'ADMINISTRATOR'
          : this.itemForm.value.role
    };

    // call register api
    this.http.registerUser(payload).subscribe(() => {
      this.showMessage = true;
      this.responseMessage = 'Registration successful';
      this.itemForm.reset();
    });
  }
}