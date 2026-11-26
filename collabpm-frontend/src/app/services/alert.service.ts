import { Injectable, signal } from '@angular/core';

export interface Alert {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {

  alerts = signal<Alert[]>([]);
  private nextId = 0;

  success(message: string, duration = 3000) {
    this.show('success', message, duration);
  }

  error(message: string, duration = 5000) {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 4000) {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 3000) {
    this.show('info', message, duration);
  }

  private show(type: Alert['type'], message: string, duration: number) {
    const id = ++this.nextId;
    this.alerts.update(a => [...a, { id, type, message }]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    this.alerts.update(a => a.filter(alert => alert.id !== id));
  }
}