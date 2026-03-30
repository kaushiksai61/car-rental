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
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.http.registerUser(this.itemForm.value).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = "You are successfully registered.";
        this.itemForm.reset();
      }
    );
  }
}