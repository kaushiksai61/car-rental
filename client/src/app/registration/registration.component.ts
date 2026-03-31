import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  itemForm!: FormGroup;
  showMessage = false;
  responseMessage: any;

  constructor(private fb: FormBuilder, private http: HttpService) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$'
          )
        ]
      ],
      role: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.itemForm.value,
      role:
        this.itemForm.value.role === 'ADMIN'
          ? 'ADMINISTRATOR'
          : this.itemForm.value.role
    };

    this.http.registerUser(payload).subscribe(() => {
      this.showMessage = true;
      this.responseMessage = 'Registration successful';
      this.itemForm.reset();
    });
  }
}
