import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusFilter' })
export class StatusFilterPipe implements PipeTransform {
  transform(list: any[], status: string): number {
    if (!list) return 0;
    return list.filter(item =>
      item.status?.toLowerCase() === status.toLowerCase()
    ).length;
  }
}

@Pipe({ name: 'paymentStatusFilter' })
export class PaymentStatusFilterPipe implements PipeTransform {
  transform(list: any[], status: string): number {
    if (!list) return 0;
    return list.filter(item =>
      item.paymentStatus?.toLowerCase() === status.toLowerCase()
    ).length;
  }
}