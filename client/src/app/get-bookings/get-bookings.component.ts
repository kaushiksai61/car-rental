import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html'
})
export class GetBookingsComponent {

  itemForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      status: ['', Validators.required]
    });

    // ✅ CRITICAL: Force validity recomputation for Jasmine test
    this.itemForm.get('status')!.valueChanges.subscribe(() => {
      this.itemForm.updateValueAndValidity({ emitEvent: false });
    });
  }
}