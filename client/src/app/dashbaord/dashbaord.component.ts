import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbaord.component.html'
})
export class DashboardComponent {
  role = '';
  filterText = '';
  todayRevenue = 0;
  totalRevenue = 0;
  dataSource: any[] = [];

  applyFilter(): void {}
  editCategory(_: any): void {}
  deleteCategory(_: any): void {}
}