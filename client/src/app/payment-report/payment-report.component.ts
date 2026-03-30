import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html'
})
export class PaymentReportComponent {
  filterForm: FormGroup;
  paymentMethods: string[] = [];
  dataSource: any[] = [];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  resetFilters(): void {}
}